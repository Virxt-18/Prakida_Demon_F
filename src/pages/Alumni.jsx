import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  LogIn,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SectionTitle from "../components/ui/SectionTitle";
import { useAuth } from "../context/AuthContext";

const PaymentStatus = {
  Confirmed: "confirmed",
  Failed: "failed",
  PendingPayment: "pending_payment",
};

const Alumni = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    yearOfPassing: "",
    phone: "",
    email: "",
    size: "",
  });

  const [status, setStatus] = useState("IDLE"); // IDLE | SUBMITTING | SUCCESS | ERROR
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [registrationDetails, setRegistrationDetails] = useState(null);

  const perks = useMemo(
    () => [
      "Free official fest merch",
      "Pro-Nite entry (included)",
      "Access to fest arena + major attractions",
      "₹1599 — everything included (no hidden add-ons)",
    ],
    [],
  );

  useEffect(() => {
    setFormData((p) => ({
      ...p,
      email: user?.email || "",
      name: user?.displayName || p.name,
    }));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const simpleValidate = () => {
    const name = String(formData.name || "").trim();
    const year = String(formData.yearOfPassing || "").trim();
    const phone = String(formData.phone || "").replace(/\s+/g, "").trim();

    if (name.length < 3) {
      setErrorMessage("Name must be at least 3 characters.");
      return false;
    }

    if (!/^\d{4}$/.test(year)) {
      setErrorMessage("Enter a valid 4-digit year (e.g. 2019). ");
      return false;
    }

    if (!/^\+?\d{7,15}$/.test(phone)) {
      setErrorMessage("Enter a valid phone number.");
      return false;
    }

    if (!String(formData.email || "").trim()) {
      setErrorMessage("Email is required.");
      return false;
    }

    if (!String(formData.size || "").trim()) {
      setErrorMessage("Please select a t-shirt size.");
      return false;
    }

    return true;
  };

  const checkPaymentStatus = async () => {
    if (!user) return;
    setCheckingStatus(true);
    try {
      const { alumniService } = await import("../services/api/alumni");
      const resp = await alumniService.getStatus();

      if (!resp) {
        setPaymentStatus(null);
        setRegistrationDetails(null);
        return;
      }

      const st = String(resp.status || "").toLowerCase();
      if (st === "confirmed" || st === "success") {
        setPaymentStatus(PaymentStatus.Confirmed);
        setRegistrationDetails(resp.details || null);
      } else if (st === "pending" || st === "pending_payment") {
        setPaymentStatus(PaymentStatus.PendingPayment);
        setRegistrationDetails(resp.details || null);
      } else {
        setPaymentStatus(st || null);
        setRegistrationDetails(resp.details || null);
      }
    } catch (err) {
      // If backend returns 404 for "not registered", just treat as empty.
      if (err?.status === 404) {
        setPaymentStatus(null);
        setRegistrationDetails(null);
      } else {
        console.error("check status error:", err);
      }
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setPaymentStatus(null);
      setRegistrationDetails(null);
      setStatus("IDLE");
      setErrorMessage("");
      return;
    }
    // Intentionally do not auto-check status; use the Refresh Status button.
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!user) {
      setStatus("ERROR");
      setErrorMessage("You must be logged in to register.");
      return;
    }

    if (!simpleValidate()) {
      setStatus("ERROR");
      return;
    }

    // Pre-open payment tab to avoid popup blockers.
    const paymentTab = window.open("about:blank", "_blank");
    const closePaymentTab = () => {
      if (paymentTab && !paymentTab.closed) paymentTab.close();
    };

    try {
      if (paymentTab) paymentTab.opener = null;
    } catch {
      // ignore
    }

    const willUseNewTab = Boolean(paymentTab);

    setStatus("SUBMITTING");
    try {
      const { alumniService } = await import("../services/api/alumni");
      const resp = await alumniService.registerAlumni({
        name: String(formData.name || "").trim(),
        yearOfPassing: String(formData.yearOfPassing || "").trim(),
        phone: String(formData.phone || "").replace(/\s+/g, "").trim(),
        email: String(formData.email || "").trim(),
        size: String(formData.size || "").trim(),
      });

      const returnedStatus = String(resp?.status || "").toLowerCase();
      if (returnedStatus === "confirmed" || returnedStatus === "success") {
        setPaymentStatus(PaymentStatus.Confirmed);
        setRegistrationDetails(resp.details || null);
        setStatus("SUCCESS");
        closePaymentTab();
        return;
      }

      if (resp?.paymentUrl) {
        setPaymentStatus(PaymentStatus.PendingPayment);
        setStatus("IDLE");

        if (willUseNewTab) {
          try {
            if (paymentTab && !paymentTab.closed) {
              paymentTab.location.href = resp.paymentUrl;
              return;
            }
          } catch {
            // fall through
          }
        }

        closePaymentTab();
        window.location.href = resp.paymentUrl;
        return;
      }

      closePaymentTab();
      setStatus("ERROR");
      setErrorMessage("Unexpected server response. Please try again.");
    } catch (err) {
      closePaymentTab();
      console.error("alumni register error:", err);
      setStatus("ERROR");
      setErrorMessage(err?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="pt-24 min-h-screen container mx-auto px-4 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-prakida-flame to-orange-500 mb-4 tracking-wider">
          ALUMNI PASS
        </h1>
        <p className="text-lg md:text-xl text-gray-400 font-sans max-w-3xl mx-auto">
          Alumni registration is backend-powered. Pay once, get everything.
        </p>
      </motion.div>

      <SectionTitle title="ALUMNI REGISTRATION" kanji="登録" />

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-black/40 backdrop-blur-md p-8 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-prakida-flame/10 blur-[100px] pointer-events-none rounded-full -translate-y-1/2 translate-x-1/2" />

          <h2 className="text-2xl font-display font-bold text-white mb-4">
            What you get (₹1599)
          </h2>
          {/* <p className="text-gray-400 mb-6">
            Alumni ko free merch rahega + Pro-Nite entry. ₹1599 mei sab kuch.
          </p> */}

          <ul className="space-y-4">
            {perks.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-prakida-flame" />
                <span className="text-gray-200">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 p-4 border border-white/10 bg-white/5">
            <p className="text-sm text-gray-300">
              Note: Payment status syncs from the backend. Use “Refresh Status” after paying.
            </p>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md p-8 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-prakida-flame/10 blur-[100px] pointer-events-none rounded-full -translate-y-1/2 translate-x-1/2" />

          <h2 className="text-2xl font-display font-bold text-white mb-6">
            Register & Pay
          </h2>

          {authLoading ? (
            <div className="text-gray-300">Loading…</div>
          ) : !user ? (
            <div className="space-y-4">
              <p className="text-gray-400">Please sign in to continue.</p>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full bg-white/5 border border-white/10 text-white font-bold py-4 hover:border-prakida-flame/60 transition-all flex items-center justify-center gap-2"
              >
                <LogIn size={18} />
                SIGN IN / REGISTER
              </button>
            </div>
          ) : paymentStatus === PaymentStatus.Confirmed ? (
            <div className="p-6 border border-green-500/40 bg-green-900/20 rounded">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="text-green-400" />
                <h3 className="text-xl font-bold text-white">Registration Complete</h3>
              </div>
              <p className="text-green-200">Status: PAID & VERIFIED</p>
              {registrationDetails?.name && (
                <p className="text-gray-200 mt-3">Name: {registrationDetails.name}</p>
              )}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={checkPaymentStatus}
                  disabled={checkingStatus}
                  className="w-full bg-white/5 border border-white/10 text-white font-bold py-3 hover:border-prakida-flame/60 transition-all"
                >
                  {checkingStatus ? "REFRESHING…" : "REFRESH STATUS"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {paymentStatus === PaymentStatus.PendingPayment && (
                <div className="p-4 border border-yellow-500/40 bg-yellow-900/20 text-yellow-200 rounded flex gap-2">
                  <AlertCircle className="shrink-0" size={18} />
                  <div>
                    Payment is pending. Please complete payment and then refresh status.
                  </div>
                </div>
              )}

              {status === "ERROR" && (
                <div className="p-4 border border-red-500/40 bg-red-900/20 text-red-300 rounded flex gap-2">
                  <AlertCircle className="shrink-0" size={18} />
                  <div>{errorMessage}</div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-display tracking-wider ml-1">
                  NAME
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    minLength={3}
                    className="w-full bg-white/5 border border-white/10 py-3 pl-12 pr-4 text-white focus:outline-none focus:border-prakida-flame focus:bg-white/10 transition-all font-sans placeholder-gray-600"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-display tracking-wider ml-1">
                    YEAR OF PASSING
                  </label>
                  <input
                    type="text"
                    name="yearOfPassing"
                    value={formData.yearOfPassing}
                    onChange={handleChange}
                    required
                    inputMode="numeric"
                    pattern="\d{4}"
                    maxLength={4}
                    className="w-full bg-white/5 border border-white/10 py-3 px-4 text-white focus:outline-none focus:border-prakida-flame focus:bg-white/10 transition-all font-sans placeholder-gray-600"
                    placeholder="YYYY"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-display tracking-wider ml-1">
                    MERCH SIZE
                  </label>
                  <select
                    name="size"
                    required
                    value={formData.size}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 py-3 px-4 text-white focus:outline-none focus:border-prakida-flame focus:bg-white/10 transition-all font-sans"
                  >
                    <option value="" className="bg-black">Select size</option>
                    <option value="S" className="bg-black">S</option>
                    <option value="M" className="bg-black">M</option>
                    <option value="L" className="bg-black">L</option>
                    <option value="XL" className="bg-black">XL</option>
                    <option value="XXL" className="bg-black">XXL</option>
                    <option value="XXXL" className="bg-black">XXXL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-display tracking-wider ml-1">
                    PHONE
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 py-3 pl-12 pr-4 text-white focus:outline-none focus:border-prakida-flame focus:bg-white/10 transition-all font-sans placeholder-gray-600"
                      placeholder="+91xxxxxxxxxx"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-display tracking-wider ml-1">
                    EMAIL
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 py-3 pl-12 pr-4 text-white focus:outline-none focus:border-prakida-flame focus:bg-white/10 transition-all font-sans placeholder-gray-600"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "SUBMITTING"}
                className="w-full bg-prakida-flame text-white font-bold py-4 hover:bg-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <CreditCard size={18} />
                {status === "SUBMITTING" ? "PROCESSING…" : "PAY ₹1599 & REGISTER"}
              </button>

              <button
                type="button"
                onClick={checkPaymentStatus}
                disabled={checkingStatus}
                className="w-full bg-white/5 border border-white/10 text-white font-bold py-3 hover:border-prakida-flame/60 transition-all"
              >
                {checkingStatus ? "REFRESHING…" : "REFRESH STATUS"}
              </button>

              {paymentStatus && paymentStatus !== PaymentStatus.Confirmed && (
                <p className="text-center text-sm text-gray-300">
                  Status: <span className="font-semibold">{paymentStatus}</span>
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alumni;
