import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { SPORTS_CONFIG } from "../lib/sportsConfig";

import { sectionSlide, buttonHover, buttonTap } from "../utils/motion";
import { User, Trophy, RefreshCw, BedDouble, SquarePen } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const Dashboard = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [eventRegs, setEventRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventRegsRefreshing, setEventRegsRefreshing] = useState(false);
  const [eventRegsRefreshedAt, setEventRegsRefreshedAt] = useState(null);

  const [alumniStatus, setAlumniStatus] = useState(null); // null = not checked yet
  const [alumniDetails, setAlumniDetails] = useState(null);
  const [alumniRefreshing, setAlumniRefreshing] = useState(false);
  const [alumniRefreshedAt, setAlumniRefreshedAt] = useState(null);
  const [alumniError, setAlumniError] = useState("");

  const [accommodationBookings, setAccommodationBookings] = useState([]);
  const [accommodationRefreshing, setAccommodationRefreshing] = useState(false);
  const [accommodationRefreshedAt, setAccommodationRefreshedAt] =
    useState(null);
  const [accommodationError, setAccommodationError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    college: "",
    gender: "",
  });

  const [editLoading, setEditLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setForm({
          name: snap.data()?.full_name || "",
          phone: snap.data()?.phone || "",
          college: snap.data()?.college || "",
          gender: snap.data()?.gender || "",
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleEditChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    setSaving(true);
    setMessage("");
    setError("");
    if (!form.gender || form.gender === "select") {
      setError("Please select a valid gender");
      setSaving(false);
      return;
    }

    if (!form.name || form.name.trim() === "") {
      setError("Please enter a valid name");
      setSaving(false);
      return;
    }

    if (!form.phone && !/^\+?\d{7,15}$/.test(form.phone)) {
      setError("Please enter a valid phone number");
      setSaving(false);
      return;
    }

    if (!form.college || form.college.trim() === "") {
      setError("Please enter a valid college name");
      setSaving(false);
      return;
    }

    try {
      await updateDoc(doc(db, "users", user.uid), {
        ...form,
        updatedAt: new Date(),
      });

      setMessage("Changes saved successfully ✔");
    } catch (err) {
      console.error(err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const resolveEventLabel = (eventId) => {
    const id = Number(eventId);
    if (!Number.isFinite(id)) return `Event #${eventId}`;

    for (const [sportName, config] of Object.entries(SPORTS_CONFIG)) {
      for (const cat of config.categories || []) {
        if (cat?.eventID === id) {
          return `${sportName} — ${cat.label} (Event #${id})`;
        }
      }
    }
    return `Event #${id}`;
  };

  const getStatusPillClass = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "confirmed")
      return "bg-green-900/30 text-green-400 border-green-500/30";
    if (s.includes("pending"))
      return "bg-yellow-900/30 text-yellow-400 border-yellow-500/30";
    if (s.includes("failed") || s.includes("cancel"))
      return "bg-red-900/30 text-red-400 border-red-500/30";
    if (s === "not_registered")
      return "bg-white/10 text-gray-400 border-white/20";
    return "bg-white/10 text-gray-200 border-white/20";
  };

  const refreshEventRegs = useCallback(
    async ({ refreshStatuses = false } = {}) => {
      if (!user) {
        setEventRegs([]);
        return;
      }

      setEventRegsRefreshing(true);
      try {
        const { eventsService } = await import("../services/api/events");
        const regList = await eventsService.getRegisteredEvents();
        const rawEvents = Array.isArray(regList?.events) ? regList.events : [];

        if (!refreshStatuses) {
          setEventRegs(rawEvents);
          setEventRegsRefreshedAt(new Date());
          return;
        }

        const shouldRefreshStatus = (e) => {
          const s = String(e?.status || "").toLowerCase();
          // Only refresh when we have no status yet or the payment is still pending.
          return !s || s.includes("pending");
        };

        const refreshed = await Promise.all(
          rawEvents.map(async (e) => {
            if (!shouldRefreshStatus(e)) return e;
            try {
              const statusRes = await eventsService.getEventStatus(e.eventId);
              return { ...e, ...statusRes };
            } catch {
              return e;
            }
          }),
        );

        setEventRegs(refreshed);
        setEventRegsRefreshedAt(new Date());
      } catch (err) {
        console.error("Error refreshing event registrations:", err);
        setEventRegs([]);
        setEventRegsRefreshedAt(new Date());
      } finally {
        setEventRegsRefreshing(false);
      }
    },
    [user],
  );

  const refreshAlumniStatus = useCallback(async () => {
    if (!user) {
      setAlumniStatus(null);
      setAlumniDetails(null);
      setAlumniError("");
      setAlumniRefreshedAt(null);
      return;
    }

    setAlumniRefreshing(true);
    setAlumniError("");

    try {
      const { alumniService } = await import("../services/api/alumni");
      const res = await alumniService.getStatus();

      if (!res) {
        setAlumniStatus("not_registered");
        setAlumniDetails(null);
        return;
      }

      const st = String(res?.status || "").toLowerCase();
      if (!st) {
        setAlumniStatus("unknown");
      } else if (st === "success") {
        setAlumniStatus("confirmed");
      } else if (st === "pending") {
        setAlumniStatus("pending_payment");
      } else {
        setAlumniStatus(st);
      }

      setAlumniDetails(res?.details || res);
    } catch (err) {
      if (err?.status === 404) {
        setAlumniStatus("not_registered");
        setAlumniDetails(null);
      } else {
        console.error("Error refreshing alumni status:", err);
        setAlumniError(err?.message || "Failed to fetch alumni status.");
      }
    } finally {
      setAlumniRefreshedAt(new Date());
      setAlumniRefreshing(false);
    }
  }, [user]);

  const refreshAccommodation = useCallback(
    async ({ refreshStatuses = false } = {}) => {
      if (!user) {
        setAccommodationBookings([]);
        setAccommodationError("");
        setAccommodationRefreshedAt(null);
        return;
      }

      setAccommodationRefreshing(true);
      setAccommodationError("");

      try {
        const { accommodationService } =
          await import("../services/api/accommodation");
        const res = await accommodationService.getAll();
        const raw = Array.isArray(res?.bookings) ? res.bookings : [];

        if (!refreshStatuses) {
          setAccommodationBookings(raw);
          setAccommodationRefreshedAt(new Date());
          return;
        }

        const shouldRefreshStatus = (b) => {
          const s = String(b?.paymentStatus || b?.status || "").toLowerCase();
          return !s || s.includes("pending");
        };

        const refreshed = await Promise.all(
          raw.map(async (b) => {
            if (!shouldRefreshStatus(b)) return b;
            try {
              const order = await accommodationService.getOrder(b?.id);
              return {
                ...b,
                paymentStatus: order?.status || b?.paymentStatus,
                paymentUrl: order?.paymentUrl || b?.paymentUrl,
                details: order?.details || b?.details,
              };
            } catch {
              return b;
            }
          }),
        );

        setAccommodationBookings(refreshed);
        setAccommodationRefreshedAt(new Date());
      } catch (err) {
        console.error("Error refreshing accommodation bookings:", err);
        setAccommodationError(
          err?.message || "Failed to fetch accommodation bookings.",
        );
        setAccommodationBookings([]);
        setAccommodationRefreshedAt(new Date());
      } finally {
        setAccommodationRefreshing(false);
      }
    },
    [user],
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        console.log("Fetching dashboard data for:", user.email);

        const { ticketService } = await import("../services/api/tickets");
        const ticketData = await ticketService.getUserTickets(
          user.uid || user.id,
        );
        setTickets(ticketData);

        // Backend-powered event registrations
        // Lightweight refresh on page load: no per-event status calls.
        await refreshEventRegs({ refreshStatuses: false });

        // Auto-check alumni once when Dashboard opens
        await refreshAlumniStatus();

        // Load accommodation bookings
        await refreshAccommodation({ refreshStatuses: false });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    const params = new URLSearchParams(window.location.search);
    const isMockMode = import.meta.env.VITE_TIQR_MOCK_MODE !== "false";

    if (
      isMockMode &&
      params.get("mock_payment_success") === "true" &&
      params.get("uid")
    ) {
      const uid = params.get("uid");
      const confirmPayment = async () => {
        const { paymentService } = await import("../services/paymentService");
        const result = await paymentService.verifyMockPayment(uid);

        if (result.success) {
          console.log("Payment Confirmed! Refreshing...");
          await fetchDashboardData();
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
          alert("Payment Successful! Verification complete.");
        } else {
          console.warn(result.message);
          alert("Payment Verification Failed: " + result.message);
        }
      };
      confirmPayment();
    }
  }, [user, refreshEventRegs, refreshAlumniStatus, refreshAccommodation]);

  const showMockPay = import.meta.env.VITE_TIQR_MOCK_MODE !== "false";

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-8 pt-24">
        <h2 className="text-3xl font-display font-bold text-white mb-4">
          AUTHENTICATION REQUIRED
        </h2>
        <p className="text-gray-400 mb-8 max-w-md">
          You must be logged in to view your Dashboard, Tickets, and
          Registration details.
        </p>
        <div className="flex gap-4">
          <motion.button
            initial={{ skewX: -12 }}
            whileHover={buttonHover}
            whileTap={buttonTap}
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-prakida-flame text-white font-bold tracking-wider skew-x-[-12deg]"
          >
            <span className="skew-x-[12deg] block">LOGIN</span>
          </motion.button>
          <motion.button
            initial={{ skewX: -12 }}
            whileHover={buttonHover}
            whileTap={buttonTap}
            onClick={() => navigate("/signup")}
            className="px-8 py-3 border border-white/20 text-white font-bold tracking-wider skew-x-[-12deg]"
          >
            <span className="skew-x-[12deg] block">SIGN UP</span>
          </motion.button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-prakida-flame font-display tracking-widest">
        LOADING DATA...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-black pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          variants={sectionSlide}
          initial="hidden"
          animate="visible"
          className="mb-12 border-b border-white/10 pb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-prakida-flame/20 p-3 rounded-full">
              <User size={32} className="text-prakida-flame" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white uppercase">
                Welcome,{" "}
                {
                  (
                    user.displayName ||
                    user.user_metadata?.full_name ||
                    "Slayer"
                  ).split(" ")[0]
                }
              </h1>
              <p className="text-gray-400 mt-1 font-mono text-sm tracking-wide">
                {user.email}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="mb-14 px-4">
          <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-6 md:p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-8 flex items-center justify-center gap-3 text-center">
              <SquarePen className="text-prakida-flame" />
              EDIT PROFILE
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              {/* FULL NAME */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono uppercase tracking-widest text-gray-400">
                  Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleEditChange}
                  className="bg-black border border-gray-700 p-3 text-white rounded-md focus:outline-none focus:border-prakida-flame"
                />
              </div>

              {/* PHONE */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono uppercase tracking-widest text-gray-400">
                  Phone Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={handleEditChange}
                  className="bg-black border border-gray-700 p-3 text-white rounded-md focus:outline-none focus:border-prakida-flame"
                />
              </div>

              {/* COLLEGE */}
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-xs font-mono uppercase tracking-widest text-gray-400">
                  College
                </label>
                <input
                  name="college"
                  value={form.college}
                  onChange={handleEditChange}
                  className="bg-black border border-gray-700 p-3 text-white rounded-md focus:outline-none focus:border-prakida-flame"
                />
              </div>

              {/* GENDER */}
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-xs font-mono uppercase tracking-widest text-gray-400">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleEditChange}
                  className="bg-black border border-gray-700 p-3 text-white rounded-md focus:outline-none focus:border-prakida-flame"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleEditSave}
                disabled={saving}
                className="w-full sm:w-auto px-10 py-3 bg-prakida-flame text-white font-bold skew-x-[-12deg] disabled:opacity-60"
              >
                <span className="skew-x-[12deg] block">
                  {saving ? "SAVING..." : "SAVE CHANGES"}
                </span>
              </button>

              {message && (
                <p className="text-green-400 text-sm text-center">{message}</p>
              )}
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-14">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-8 flex items-center justify-center gap-3 text-center">
            <Trophy className="text-prakida-flame" /> YOUR BATTLES
          </h2>

          <div className="flex items-center justify-center gap-3 mb-8">
            <button
              type="button"
              onClick={() => refreshEventRegs({ refreshStatuses: true })}
              disabled={eventRegsRefreshing}
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 bg-white/5 text-white font-bold text-xs tracking-widest uppercase hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              title={
                eventRegsRefreshing
                  ? "Refreshing..."
                  : "Refresh registration status"
              }
            >
              <RefreshCw
                size={16}
                className={eventRegsRefreshing ? "animate-spin" : ""}
              />
              {eventRegsRefreshing ? "Refreshing" : "Refresh Status"}
            </button>

            {eventRegsRefreshedAt ? (
              <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500">
                Last refresh: {eventRegsRefreshedAt.toLocaleTimeString()}
              </span>
            ) : null}
          </div>

          {eventRegs.length === 0 ? (
            <div className="bg-white/5 border border-white/10 p-10 text-center rounded-sm max-w-4xl mx-auto">
              <p className="text-gray-400 mb-5">
                You have not registered for any events yet.
              </p>
              <Link
                to="/register"
                className="inline-block px-8 py-3 bg-prakida-flame text-white font-bold skew-x-[-12deg]"
              >
                <span className="skew-x-[12deg] block">REGISTER NOW</span>
              </Link>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto grid grid-cols-1 gap-8">
              {eventRegs
                .slice()
                .sort((a, b) => Number(a?.eventId) - Number(b?.eventId))
                .map((e) => (
                  <motion.div
                    key={String(e?.eventId)}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-sm relative overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      <div className="text-center md:text-left">
                        <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2">
                          {resolveEventLabel(e?.eventId)}
                        </h3>
                        <p className="text-sm text-gray-400 font-mono tracking-widest uppercase">
                          {String(e?.type || "").replace(/_/g, " ")}
                        </p>
                      </div>

                      <div className="flex flex-col items-center md:items-end gap-3">
                        <span
                          className={`px-4 py-2 rounded text-xs md:text-sm font-bold uppercase border ${getStatusPillClass(
                            e?.status,
                          )}`}
                        >
                          {String(e?.status || "registered").replace(/_/g, " ")}
                        </span>

                        {String(e?.status || "")
                          .toLowerCase()
                          .includes("pending") && e?.paymentUrl ? (
                          <a
                            href={e.paymentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-prakida-flame text-white px-8 py-3 font-bold text-sm hover:bg-red-600"
                          >
                            PAY NOW
                          </a>
                        ) : null}
                      </div>
                    </div>

                    <div className="border-t border-white/10 mt-8 pt-6 text-center md:text-left">
                      <div className="text-xs text-gray-500 font-mono">
                        Updated:{" "}
                        <span className="text-gray-300">
                          {e?.updatedAt
                            ? new Date(
                                typeof e.updatedAt === "string"
                                  ? e.updatedAt
                                  : e.updatedAt?.seconds
                                    ? e.updatedAt.seconds * 1000
                                    : Date.now(),
                              ).toLocaleString()
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </div>

        <div className="mb-14">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-8 flex items-center justify-center gap-3 text-center">
            ALUMNI PASS STATUS
          </h2>

          <div className="flex items-center justify-center gap-3 mb-8">
            <button
              type="button"
              onClick={refreshAlumniStatus}
              disabled={alumniRefreshing}
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 bg-white/5 text-white font-bold text-xs tracking-widest uppercase hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              title={
                alumniRefreshing
                  ? "Refreshing..."
                  : "Refresh alumni registration status"
              }
            >
              <RefreshCw
                size={16}
                className={alumniRefreshing ? "animate-spin" : ""}
              />
              {alumniRefreshing ? "Refreshing" : "Refresh Status"}
            </button>

            {alumniRefreshedAt ? (
              <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500">
                Last refresh: {alumniRefreshedAt.toLocaleTimeString()}
              </span>
            ) : null}
          </div>

          <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 p-8 md:p-10 rounded-sm">
            {alumniError ? (
              <p className="text-red-400 font-mono text-sm">{alumniError}</p>
            ) : alumniStatus == null ? (
              <p className="text-gray-400 font-mono text-sm">
                Checking alumni status...
              </p>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2">
                    Alumni Registration
                  </h3>
                  <p className="text-sm text-gray-400 font-mono tracking-widest uppercase">
                    ₹1599 • free merch • pro-nite entry
                  </p>
                </div>

                <div className="flex flex-col items-center md:items-end gap-3">
                  <span
                    className={`px-4 py-2 rounded text-xs md:text-sm font-bold uppercase border ${getStatusPillClass(
                      alumniStatus,
                    )}`}
                  >
                    {String(alumniStatus).replace(/_/g, " ")}
                  </span>

                  {String(alumniStatus || "")
                    .toLowerCase()
                    .includes("pending") && alumniDetails?.paymentUrl ? (
                    <a
                      href={alumniDetails.paymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-prakida-flame text-white px-8 py-3 font-bold text-sm hover:bg-red-600"
                    >
                      PAY NOW
                    </a>
                  ) : (
                    <Link
                      to="/alumni"
                      className="bg-white/10 border border-white/15 text-white px-8 py-3 font-bold text-sm hover:bg-white/15"
                    >
                      VIEW DETAILS
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-14">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-8 flex items-center justify-center gap-3 text-center">
            <BedDouble className="text-prakida-flame" /> ACCOMMODATION STATUS
          </h2>

          <div className="flex items-center justify-center gap-3 mb-8">
            <button
              type="button"
              onClick={() => refreshAccommodation({ refreshStatuses: true })}
              disabled={accommodationRefreshing}
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 bg-white/5 text-white font-bold text-xs tracking-widest uppercase hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              title={
                accommodationRefreshing
                  ? "Refreshing..."
                  : "Refresh accommodation status"
              }
            >
              <RefreshCw
                size={16}
                className={accommodationRefreshing ? "animate-spin" : ""}
              />
              {accommodationRefreshing ? "Refreshing" : "Refresh Status"}
            </button>

            {accommodationRefreshedAt ? (
              <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500">
                Last refresh: {accommodationRefreshedAt.toLocaleTimeString()}
              </span>
            ) : null}
          </div>

          {accommodationError ? (
            <div className="max-w-4xl mx-auto bg-white/5 border border-red-500/30 p-8 md:p-10 rounded-sm">
              <p className="text-red-400 font-mono text-sm">
                {accommodationError}
              </p>
            </div>
          ) : accommodationBookings.length === 0 ? (
            <div className="bg-white/5 border border-white/10 p-10 text-center rounded-sm max-w-4xl mx-auto">
              <p className="text-gray-400 mb-5">
                No accommodation bookings found.
              </p>
              <Link
                to="/register/accommodation"
                className="inline-block px-8 py-3 bg-prakida-flame text-white font-bold skew-x-[-12deg]"
              >
                <span className="skew-x-[12deg] block">BOOK NOW</span>
              </Link>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto grid grid-cols-1 gap-8">
              {accommodationBookings
                .slice()
                .sort((a, b) => {
                  const aMs = a?.createdAt?.seconds
                    ? a.createdAt.seconds * 1000
                    : 0;
                  const bMs = b?.createdAt?.seconds
                    ? b.createdAt.seconds * 1000
                    : 0;
                  return bMs - aMs;
                })
                .map((b) => {
                  const status = b?.paymentStatus || b?.status || "unknown";
                  const membersCount = Array.isArray(b?.members)
                    ? b.members.length
                    : 0;
                  return (
                    <motion.div
                      key={String(b?.id || b?.groupId || Math.random())}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-sm relative overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div className="text-center md:text-left">
                          <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2">
                            {b?.teamName || "Accommodation Booking"}
                          </h3>
                          <p className="text-sm text-gray-400 font-mono tracking-widest uppercase">
                            {(b?.college || "—").toString()} • {membersCount}{" "}
                            member{membersCount === 1 ? "" : "s"}
                          </p>
                          <p className="text-xs text-gray-500 font-mono mt-2">
                            Booking ID:{" "}
                            <span className="text-gray-300">
                              {String(b?.id || "—")}
                            </span>
                          </p>
                        </div>

                        <div className="flex flex-col items-center md:items-end gap-3">
                          <span
                            className={`px-4 py-2 rounded text-xs md:text-sm font-bold uppercase border ${getStatusPillClass(
                              status,
                            )}`}
                          >
                            {String(status).replace(/_/g, " ")}
                          </span>

                          {String(status || "")
                            .toLowerCase()
                            .includes("pending") && b?.paymentUrl ? (
                            <a
                              href={b.paymentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-prakida-flame text-white px-8 py-3 font-bold text-sm hover:bg-red-600"
                            >
                              PAY NOW
                            </a>
                          ) : (
                            <Link
                              to="/register/accommodation"
                              className="bg-white/10 border border-white/15 text-white px-8 py-3 font-bold text-sm hover:bg-white/15"
                            >
                              VIEW / BOOK
                            </Link>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-white/10 mt-8 pt-6 text-center md:text-left">
                        <div className="text-xs text-gray-500 font-mono">
                          Updated:{" "}
                          <span className="text-gray-300">
                            {b?.updatedAt
                              ? new Date(
                                  typeof b.updatedAt === "string"
                                    ? b.updatedAt
                                    : b.updatedAt?.seconds
                                      ? b.updatedAt.seconds * 1000
                                      : Date.now(),
                                ).toLocaleString()
                              : "—"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          )}
        </div>

        {}
        {tickets.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
              YOUR TICKETS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 p-6 rounded-sm relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-display font-bold text-white">
                        STAR NIGHT
                      </h3>
                      <p className="text-purple-400 text-sm font-mono tracking-widest">
                        ADMIT ONE
                      </p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-xs font-bold uppercase border ${
                        ticket.payment_status === "confirmed"
                          ? "bg-green-900/30 text-green-400 border-green-500/30"
                          : "bg-yellow-900/30 text-yellow-400 border-yellow-500/30"
                      }`}
                    >
                      {ticket.payment_status}
                    </div>
                  </div>

                  <div className="flex justify-between items-end border-t border-white/10 pt-4">
                    <div className="text-sm text-gray-400">
                      <p>
                        Pass ID:{" "}
                        <span className="text-white font-mono">
                          {ticket.id.slice(0, 8)}
                        </span>
                      </p>
                      <p>
                        Price:{" "}
                        <span className="text-white">₹{ticket.price}</span>
                      </p>
                    </div>
                    {ticket.payment_status === "confirmed" ? (
                      <button className="bg-white text-black px-4 py-2 font-bold text-xs hover:bg-gray-200">
                        VIEW QR CODE
                      </button>
                    ) : showMockPay ? (
                      <button
                        onClick={() =>
                          (window.location.href = `/dashboard?mock_payment_success=true&uid=${ticket.tiqr_booking_uid}`)
                        }
                        className="bg-prakida-flame text-white px-4 py-2 font-bold text-xs hover:bg-red-600"
                      >
                        PAY NOW (MOCK)
                      </button>
                    ) : (
                      <span className="text-xs text-gray-500 font-mono">
                        Payment Pending via TiQR
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/** legacy registrations section removed (duplicated UI) **/}
      </div>
    </section>
  );
};

export default Dashboard;
