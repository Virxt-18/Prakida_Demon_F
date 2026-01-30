import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { Users, BedDouble, RefreshCw } from "lucide-react";
import MemberSelector from "../components/MemberSelector";
import { SPORTS_CONFIG } from "../lib/sportsConfig";

const PRICE_PER_PERSON = 920;

const AccommodationRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [error, setError] = useState("");

  const [college, setCollege] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");

  const [accommodationBookings, setAccommodationBookings] = useState([]);
  const [accommodationRefreshing, setAccommodationRefreshing] = useState(false);
  const [accommodationError, setAccommodationError] = useState("");
  const [accommodationRefreshedAt, setAccommodationRefreshedAt] = useState(null);

  const [eventRegs, setEventRegs] = useState([]);

  const autoTeamName = useMemo(() => {
    const seed = String(user?.uid || user?.email || "").trim();
    const cleaned = seed.replace(/[^a-zA-Z0-9]/g, "");
    const suffix = cleaned.slice(0, 8).toUpperCase();
    if (suffix) return `TEAM-${suffix}`;

    // Fallback (should be rare): keep it stable for the session.
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `TEAM-${rand}`;
  }, [user?.uid, user?.email]);

  const normalizeName = (value) =>
    String(value || "")
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();

  const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

  const normalizePhone = (value) => {
    const raw = String(value || "");
    const digits = raw.replace(/\D/g, "");
    // keep last 10 digits for Indian numbers with +91 prefix
    return digits.length > 10 ? digits.slice(-10) : digits;
  };

  const getMemberIdentity = (member) => {
    const phone = normalizePhone(member?.phone || member?.phone_number);
    const email = normalizeEmail(member?.email);
    const name = normalizeName(member?.name);

    // Prefer the full composite identity when possible.
    if (name && email && phone) return `n:${name}|e:${email}|p:${phone}`;
    if (email && phone) return `e:${email}|p:${phone}`;
    if (email && name) return `e:${email}|n:${name}`;
    if (phone && name) return `p:${phone}|n:${name}`;
    if (phone) return `p:${phone}`;
    if (email) return `e:${email}`;
    return `n:${name}`;
  };

  const dedupeMembers = (list) => {
    const out = [];
    const seen = new Set();

    for (const m of Array.isArray(list) ? list : []) {
      const name = normalizeName(m?.name);
      const email = normalizeEmail(m?.email);
      const phone = normalizePhone(m?.phone || m?.phone_number);

      // Only dedupe when all three match (as requested).
      if (name && email && phone) {
        const key = `n:${name}|e:${email}|p:${phone}`;
        if (seen.has(key)) continue;
        seen.add(key);
      }

      out.push(m);
    }

    return out;
  };

  const getMemberKey = (member, index) => {
    // Selection key should remain stable even when list is filtered/sorted.
    const identity = getMemberIdentity(member);
    return `${identity}::${index}`;
  };

  const statusRank = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "confirmed") return 3;
    if (s.includes("pending")) return 2;
    if (s.includes("failed") || s.includes("cancel")) return 1;
    return 0;
  };

  const resolveEventLabel = (eventId) => {
    const id = Number(eventId);
    if (!Number.isFinite(id)) return `Event #${eventId}`;

    for (const [sportName, config] of Object.entries(SPORTS_CONFIG)) {
      for (const cat of config.categories || []) {
        if (cat?.eventID === id) {
          return `${sportName} — ${cat.label}`;
        }
      }
    }
    return `Event #${id}`;
  };

  const memberSportsByIdentity = useMemo(() => {
    const map = new Map();
    const rows = Array.isArray(eventRegs) ? eventRegs : [];

    const add = (identity, label) => {
      if (!identity || !label) return;
      const prev = map.get(identity);
      if (!prev) {
        map.set(identity, new Set([label]));
      } else {
        prev.add(label);
      }
    };

    for (const e of rows) {
      const label = resolveEventLabel(e?.eventId);

      const members = Array.isArray(e?.members) ? e.members : [];
      if (members.length) {
        for (const m of members) add(getMemberIdentity(m), label);
      } else {
        // fallback if backend returns leader details instead of members
        const identity = getMemberIdentity({
          name: e?.name,
          email: e?.email,
          phone: e?.phone,
        });
        add(identity, label);
      }
    }

    const out = new Map();
    for (const [k, v] of map.entries()) {
      out.set(k, Array.from(v).sort());
    }
    return out;
  }, [eventRegs]);

  const getSportsMeta = (member) => {
    const list = memberSportsByIdentity.get(getMemberIdentity(member)) || [];
    if (!list.length) return null;
    return `Sports: ${list.join(" • ")}`;
  };

  const memberAccommodationStatusByIdentity = useMemo(() => {
    const map = new Map();
    const bookings = Array.isArray(accommodationBookings)
      ? accommodationBookings
      : [];

    for (const booking of bookings) {
      const st =
        booking?.paymentStatus || booking?.status || booking?.payment_status || "";
      const rank = statusRank(st);
      const bookingMembers = Array.isArray(booking?.members) ? booking.members : [];

      for (const m of bookingMembers) {
        const identity = getMemberIdentity(m);
        if (!identity) continue;

        const prev = map.get(identity);
        if (!prev || statusRank(prev) < rank) {
          map.set(identity, String(st || "unknown"));
        }
      }
    }

    return map;
  }, [accommodationBookings]);

  const bookedMembers = useMemo(() => {
    const list = Array.isArray(members) ? members : [];
    return list.filter((m) => {
      const st = memberAccommodationStatusByIdentity.get(getMemberIdentity(m));
      return String(st || "").toLowerCase() === "confirmed";
    });
  }, [members, memberAccommodationStatusByIdentity]);

  const pendingMembers = useMemo(() => {
    const list = Array.isArray(members) ? members : [];
    return list.filter((m) => {
      const st = memberAccommodationStatusByIdentity.get(getMemberIdentity(m));
      const s = String(st || "").toLowerCase();
      return s && s !== "confirmed" && s.includes("pending");
    });
  }, [members, memberAccommodationStatusByIdentity]);

  const remainingMembers = useMemo(() => {
    const list = Array.isArray(members) ? members : [];
    return list.filter((m) => {
      const st = memberAccommodationStatusByIdentity.get(getMemberIdentity(m));
      return !st;
    });
  }, [members, memberAccommodationStatusByIdentity]);

  const selectedMemberObjects = useMemo(() => {
    const set = new Set(selectedMembers);
    return (remainingMembers || []).filter((m, idx) => set.has(getMemberKey(m, idx)));
  }, [remainingMembers, selectedMembers]);

  // If the remaining list changes (someone becomes booked), drop invalid selections.
  useEffect(() => {
    const allowed = new Set(
      (remainingMembers || []).map((m, idx) => getMemberKey(m, idx)),
    );
    setSelectedMembers((prev) => prev.filter((k) => allowed.has(k)));
  }, [remainingMembers]);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const refreshAccommodationBookings = async ({ refreshStatuses = false } = {}) => {
    if (!user) return;

    setAccommodationRefreshing(true);
    setAccommodationError("");
    try {
      const { accommodationService } = await import("../services/api/accommodation");
      const res = await accommodationService.getAll();
      const raw = Array.isArray(res?.bookings) ? res.bookings : [];

      if (!refreshStatuses) {
        setAccommodationBookings(raw);
        setAccommodationRefreshedAt(new Date());
        return;
      }

      const shouldRefresh = (b) => {
        const s = String(b?.paymentStatus || b?.status || "").toLowerCase();
        return !s || s.includes("pending");
      };

      const refreshed = await Promise.all(
        raw.map(async (b) => {
          if (!shouldRefresh(b)) return b;
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
      console.error(err);
      setAccommodationError(err?.message || "Failed to fetch accommodation status.");
      setAccommodationBookings([]);
      setAccommodationRefreshedAt(new Date());
    } finally {
      setAccommodationRefreshing(false);
    }
  };

  // Fetch confirmed members
  useEffect(() => {
    if (!user) return;

    const fetchRegistrations = async () => {
      try {
        const ref = doc(db, "events_registrations", user.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setMembers([]);
          return;
        }

        const data = snap.data();
        console.log(data);
        const confirmedMembers = Object.values(data?.events ?? {})
          .filter((e) => e.status === "confirmed")
          .flatMap((e) => e.members ?? []);

        setMembers(dedupeMembers(confirmedMembers));
      } catch (err) {
        console.error(err);
        setError("Failed to load registered members.");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [user]);

  // Fetch registered events (same data source used by Dashboard)
  useEffect(() => {
    if (!user) return;

    const fetchEventRegs = async () => {
      try {
        const { eventsService } = await import("../services/api/events");
        const regList = await eventsService.getRegisteredEvents();
        const raw = Array.isArray(regList?.events) ? regList.events : [];
        setEventRegs(raw);
      } catch (err) {
        console.error(err);
        // Keep silent: accommodation can work without the sports labels.
        setEventRegs([]);
      }
    };

    fetchEventRegs();
  }, [user]);

  // Fetch accommodation status for current user
  useEffect(() => {
    if (!user) return;
    refreshAccommodationBookings({ refreshStatuses: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Price calculation
  const totalAmount = useMemo(
    () => selectedMembers.length * PRICE_PER_PERSON,
    [selectedMembers.length],
  );

  // Placeholder payment handler
  const handlePayment = async () => {
    if (!selectedMemberObjects.length) return;

    setBookingError("");
    setPaymentUrl("");

    const cleanedCollege = String(college || "").trim();
    const cleanedTeamName = String(autoTeamName || "").trim();

    if (!cleanedCollege) {
      setBookingError("College is required.");
      return;
    }
    if (!cleanedTeamName) {
      setBookingError("Failed to generate a team name. Please refresh the page.");
      return;
    }

    const missingIndex = selectedMemberObjects.findIndex((m) => {
      const name = String(m?.name || "").trim();
      const email = String(m?.email || "").trim();
      const phone = String(m?.phone || m?.phone_number || "").trim();
      const gender = String(m?.gender || "").trim();
      return !name || !email || !phone || !gender;
    });

    if (missingIndex !== -1) {
      setBookingError(
        `Member #${missingIndex + 1} is missing required details (name/email/phone/gender).`,
      );
      return;
    }

    setBookingLoading(true);
    try {
      const { accommodationService } = await import(
        "../services/api/accommodation"
      );

      const res = await accommodationService.bookAccommodation({
        college: cleanedCollege,
        teamName: cleanedTeamName,
        members: selectedMemberObjects,
      });

      const url = String(res?.paymentUrl || "");
      if (url) {
        setPaymentUrl(url);
        // Open only in a new tab. If the popup is blocked, the user can use the
        // "OPEN PAYMENT LINK" button that appears below.
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        setBookingError("Booking created, but payment link was not returned.");
      }
    } catch (err) {
      setBookingError(
        err?.message || "Failed to initiate accommodation booking. Please try again.",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        Loading accommodation data...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-black pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
            <BedDouble className="text-prakida-flame" />
            Accommodation Booking
          </h1>
          <p className="text-gray-400 mt-2">
            Select confirmed participants for accommodation.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-500/50 bg-red-900/20 text-red-400">
            {error}
          </div>
        )}

        {bookingError && (
          <div className="mb-6 p-4 border border-red-500/50 bg-red-900/20 text-red-400">
            {bookingError}
          </div>
        )}

        {accommodationError && (
          <div className="mb-6 p-4 border border-red-500/50 bg-red-900/20 text-red-400">
            {accommodationError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MEMBER LIST */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="text-prakida-flame" />
                Eligible Members
              </h2>

              <button
                type="button"
                onClick={() => refreshAccommodationBookings({ refreshStatuses: true })}
                disabled={accommodationRefreshing}
                className="inline-flex items-center gap-2 px-4 py-2 border border-white/15 bg-white/5 text-white font-bold text-[10px] tracking-widest uppercase hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={14} className={accommodationRefreshing ? "animate-spin" : ""} />
                {accommodationRefreshing ? "Refreshing" : "Refresh"}
              </button>
            </div>

            <div className="text-xs text-gray-500 font-mono">
              Booked: <span className="text-gray-200">{bookedMembers.length}</span> /{" "}
              {members.length} • Pending: <span className="text-gray-200">{pendingMembers.length}</span> • Remaining:{" "}
              <span className="text-gray-200">{remainingMembers.length}</span>
              {accommodationRefreshedAt ? (
                <span className="ml-2">(updated {accommodationRefreshedAt.toLocaleTimeString()})</span>
              ) : null}
            </div>

            {members.length === 0 && (
              <div className="text-gray-400">
                No confirmed participants found.
              </div>
            )}

            {bookedMembers.length > 0 ? (
              <div className="space-y-2">
                <div className="text-xs font-mono tracking-widest uppercase text-gray-500">
                  Already Booked (Confirmed)
                </div>
                <div className="space-y-3">
                  {bookedMembers.map((member, idx) => (
                    <div
                      key={`booked-${getMemberIdentity(member)}-${idx}`}
                      className="flex items-center justify-between p-4 border bg-white/5 border-green-500/30"
                    >
                      <div>
                        <p className="text-white font-medium">{member.name}</p>
                        <p className="text-sm text-gray-400">{member.email}</p>
                        {getSportsMeta(member) ? (
                          <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                            {getSportsMeta(member)}
                          </p>
                        ) : null}
                      </div>
                      <span className="px-3 py-1 rounded text-xs font-bold uppercase border bg-green-900/30 text-green-400 border-green-500/30">
                        confirmed
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {pendingMembers.length > 0 ? (
              <div className="space-y-2">
                <div className="text-xs font-mono tracking-widest uppercase text-gray-500">
                  In Progress (Pending Payment)
                </div>
                <div className="space-y-3">
                  {pendingMembers.map((member, idx) => (
                    <div
                      key={`pending-${getMemberIdentity(member)}-${idx}`}
                      className="flex items-center justify-between p-4 border bg-white/5 border-yellow-500/30"
                    >
                      <div>
                        <p className="text-white font-medium">{member.name}</p>
                        <p className="text-sm text-gray-400">{member.email}</p>
                        {getSportsMeta(member) ? (
                          <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                            {getSportsMeta(member)}
                          </p>
                        ) : null}
                      </div>
                      <span className="px-3 py-1 rounded text-xs font-bold uppercase border bg-yellow-900/30 text-yellow-400 border-yellow-500/30">
                        pending
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="space-y-2">
              <div className="text-xs font-mono tracking-widest uppercase text-gray-500">
                Remaining for Accommodation
              </div>
              {remainingMembers.length === 0 ? (
                <div className="text-gray-400">All eligible members are already booked.</div>
              ) : (
                <MemberSelector
                  members={remainingMembers}
                  selectedMembers={selectedMembers}
                  setSelectedMembers={setSelectedMembers}
                  getMemberKey={getMemberKey}
                  getMemberMeta={(m) => getSportsMeta(m)}
                />
              )}
            </div>
          </div>

          {/* CART */}
          <div className="bg-white/5 border border-white/10 p-6 h-fit">
            <h3 className="text-xl font-bold text-white mb-4">
              Accommodation Cart
            </h3>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-xs font-mono tracking-widest uppercase text-gray-500 mb-2">
                  College
                </label>
                <input
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="Institute Name"
                  className="w-full bg-black/40 border border-white/10 text-white px-3 py-2 outline-none focus:border-prakida-flame/60"
                />
              </div>

              <p className="text-[10px] font-mono tracking-widest uppercase text-gray-500">
                Team Name: <span className="text-gray-200">{autoTeamName}</span>
              </p>
            </div>

            <div className="space-y-2 text-gray-400 text-sm">
              <p>
                Selected Members:{" "}
                <span className="text-white font-bold">
                  {selectedMembers.length}
                </span>
              </p>
              <p>Price per person: ₹{PRICE_PER_PERSON}</p>
            </div>

            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="text-lg text-white font-bold">
                Total: ₹{totalAmount}
              </p>
            </div>

            <button
              disabled={!selectedMembers.length || bookingLoading}
              onClick={handlePayment}
              className="mt-6 w-full bg-prakida-flame text-white py-3 font-bold tracking-wider disabled:opacity-50"
            >
              {bookingLoading ? "INITIATING..." : "PAY NOW"}
            </button>

            {paymentUrl ? (
              <a
                href={paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block w-full text-center border border-white/15 bg-white/5 text-white py-3 font-bold tracking-wider hover:bg-white/10"
              >
                OPEN PAYMENT LINK
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccommodationRegistration;
