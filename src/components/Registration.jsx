import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { SPORTS_CONFIG } from "../lib/sportsConfig";
import { formatINRWithSymbol, formatRegistrationFee } from "../lib/pricing";
import { buttonHover, buttonTap, sectionSlide } from "../utils/motion";
import { Plus, Trash2, Trophy, Users, Shield, Crown } from "lucide-react";

const getSelectionFromQuery = (search) => {
  const params = new URLSearchParams(search);
  const sportParam = params.get("sport");
  const categoryParam = params.get("category");

  const fallbackSport = Object.keys(SPORTS_CONFIG)[0];
  const initialSport =
    sportParam && SPORTS_CONFIG[sportParam] ? sportParam : fallbackSport;

  const categories = SPORTS_CONFIG[initialSport]?.categories || [];
  const initialCategory =
    categoryParam && categories.some((c) => c.id === categoryParam)
      ? categoryParam
      : categories[0]?.id;

  return { initialSport, initialCategory };
};

const Registration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLockRef = useRef(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const { initialSport, initialCategory } = getSelectionFromQuery(location.search);

  const [selectedSport, setSelectedSport] = useState(initialSport);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const [registrationMode, setRegistrationMode] = useState("group");

  const [userRole, setUserRole] = useState("Captain");

  const [registrantName, setRegistrantName] = useState(
    user?.user_metadata?.full_name || user?.displayName || "",
  );

  const [teamName, setTeamName] = useState("");
  const [college, setCollege] = useState("");
  const [contactEmail, setContactEmail] = useState(user?.email || "");
  const [contactPhone, setContactPhone] = useState("");

  const [gender, setGender] = useState("");

  const [members, setMembers] = useState([]);

  const currentConfig = useMemo(() => {
    const sport = SPORTS_CONFIG[selectedSport];
    return sport?.categories?.find((c) => c.id === selectedCategory);
  }, [selectedSport, selectedCategory]);

  useEffect(() => {
    const { initialSport: sportFromQuery, initialCategory: categoryFromQuery } =
      getSelectionFromQuery(location.search);

    // If user navigates to /register with query params, reflect them.
    setSelectedSport(sportFromQuery);
    setSelectedCategory(categoryFromQuery);
    setMembers([]);
  }, [location.search]);

  useEffect(() => {
    setRegistrantName(user?.user_metadata?.full_name || user?.displayName || "");
    // Auto-fill email once the user is available; don't overwrite manual edits.
    if (!contactEmail) {
      setContactEmail(user?.email || "");
    }
  }, [user, contactEmail]);

  useEffect(() => {
    const current = currentConfig;
    if (!current) return;

    const allowSolo = current.minPlayers === 1;
    const allowGroup = current.maxPlayers > 1;

    let nextMode = registrationMode;
    if (!allowGroup) nextMode = "solo";
    else if (!allowSolo) nextMode = "group";
    else if (registrationMode !== "solo" && registrationMode !== "group") nextMode = "solo";

    if (nextMode !== registrationMode) {
      setRegistrationMode(nextMode);
    }

    if (nextMode === "solo") {
      setUserRole("Player");
      if (members.length) setMembers([]);
    } else {
      if (userRole === "Player") setUserRole("Captain");
    }
  }, [currentConfig, members.length, registrationMode, userRole]);

  useEffect(() => {
    const config = currentConfig;
    if (!config) return;

    const maxAdditional = registrationMode === "group" ? config.maxPlayers - 1 : 0;

    setMembers((prev) =>
      prev.length > maxAdditional ? prev.slice(0, maxAdditional) : prev,
    );
  }, [currentConfig, registrationMode]);

  const handleSportChange = (e) => {
    const newSport = e.target.value;
    setSelectedSport(newSport);

    setSelectedCategory(SPORTS_CONFIG[newSport].categories[0].id);
    setMembers([]);
  };

  const canChooseMode = () => {
    const current = currentConfig;
    if (!current) return false;
    return current.minPlayers === 1 && current.maxPlayers > 1;
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const addMember = () => {
    const config = currentConfig;
    if (registrationMode !== "group") return;
    const maxAdditional = config.maxPlayers - 1;

    if (members.length < maxAdditional) {
      setMembers([
        ...members,
        { name: "", role: "Player", gender: gender || "", email: "", contact: "" },
      ]);
    }
  };

  const removeMember = (index) => {
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Guard against accidental double-submits (can open payment twice).
    if (isSubmitting || submitLockRef.current) return;

    if (!user) {
      navigate("/login");
      return;
    }

    const config = currentConfig;
    const eventID = config?.eventID;
    const totalTeamSize = 1 + members.length;
    const registrationType = registrationMode;
    const leadershipEnabled =
      registrationType === "group" && Boolean(config?.teamNameRequired);

    if (!eventID) {
      setStatus({
        type: "error",
        message: "Invalid event selection. Please re-select sport/category.",
      });
      return;
    }

    if (!registrantName?.trim()) {
      setStatus({
        type: "error",
        message: "Your name is required.",
      });
      return;
    }

    if (totalTeamSize < config.minPlayers) {
      setStatus({
        type: "error",
        message: `Minimum ${config.minPlayers} players required (You + ${config.minPlayers - 1} others).`,
      });
      return;
    }

    if (leadershipEnabled) {
      const rosterCaptains = members.filter((m) => m.role === "Captain").length;
      const totalCaptains = (userRole === "Captain" ? 1 : 0) + rosterCaptains;

      if (totalCaptains === 0) {
        setStatus({
          type: "error",
          message: "Every team must have a Captain. Please assign one.",
        });
        return;
      }
      if (totalCaptains > 1) {
        setStatus({
          type: "error",
          message: "There can be only one Captain per team.",
        });
        return;
      }

      const rosterVCs = members.filter((m) => m.role === "Vice-Captain").length;
      const totalVCs = (userRole === "Vice-Captain" ? 1 : 0) + rosterVCs;

      if (totalVCs > 1) {
        setStatus({
          type: "error",
          message: "There can be only one Vice-Captain per team.",
        });
        return;
      }
    }

    if (!contactPhone) {
      setStatus({
        type: "error",
        message: "Your phone number is required.",
      });
      return;
    }

    if (!gender) {
      setStatus({
        type: "error",
        message: "Gender is required.",
      });
      return;
    }

    if (!college) {
      setStatus({
        type: "error",
        message: "College is required.",
      });
      return;
    }

    if (leadershipEnabled && !teamName) {
      setStatus({
        type: "error",
        message: "Team name is required for team registrations.",
      });
      return;
    }

    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.email) {
        setStatus({
          type: "error",
          message: `Player #${i + 2} (${m.name || "Unknown"}) is missing an Email.`,
        });
        return;
      }

      if (!m.gender) {
        setStatus({
          type: "error",
          message: `Player #${i + 2} (${m.name || "Unknown"}) is missing a gender.`,
        });
        return;
      }

      if (registrationType === "group") {
        if (!m.name) {
          setStatus({
            type: "error",
            message: `Player #${i + 2} is missing a name.`,
          });
          return;
        }
        if (!m.contact) {
          setStatus({
            type: "error",
            message: `Player #${i + 2} (${m.name || "Unknown"}) is missing a phone number.`,
          });
          return;
        }
      }

      if (leadershipEnabled && (m.role === "Captain" || m.role === "Vice-Captain") && !m.contact) {
        setStatus({
          type: "error",
          message: `${m.role} (${m.name}) must have a phone number.`,
        });
        return;
      }
    }

    // Lock immediately before starting the async booking.
    submitLockRef.current = true;
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const { eventsService } = await import("../services/api/events");

      const primaryMember = {
        name: registrantName.trim(),
        email: contactEmail || user?.email || "",
        phone: contactPhone,
        role: leadershipEnabled ? userRole : "Player",
        gender,
      };

      const memberPayload =
        registrationType === "group"
          ? [
              primaryMember,
              ...members.map((m) => ({
                name: m.name,
                email: m.email,
                phone: m.contact,
                role: leadershipEnabled ? (m.role || "Player") : "Player",
                gender: m.gender,
              })),
            ]
          : [primaryMember];

      setStatus({ type: "info", message: "Creating booking..." });

      const response = await eventsService.bookEvent({
        eventId: eventID,
        type: registrationType,
        name: registrantName.trim(),
        phone: contactPhone,
        college,
        members: memberPayload,
        role: leadershipEnabled ? userRole : "Player",
        gender,
        teamName: leadershipEnabled ? teamName : undefined,
      });

      setStatus({ type: "success", message: "Redirecting to payment..." });
      if (response?.paymentUrl) {
        // Use a single deterministic navigation to avoid opening twice.
        // (Some browsers return null for window.open when using noopener.)
        window.location.assign(response.paymentUrl);
      } else {
        setStatus({
          type: "error",
          message: "Booking created but payment URL is missing. Please contact support.",
        });
        submitLockRef.current = false;
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Registration Error:", error);

      const backendMessage =
        error?.payload?.message ||
        error?.payload?.error ||
        error?.payload?.raw ||
        "";

      setStatus({
        type: "error",
        message:
          [error?.message, backendMessage].filter(Boolean).join(" — ") ||
          "Failed to register. Please try again.",
      });
      submitLockRef.current = false;
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8">
        <h2 className="text-3xl font-display font-bold text-white mb-4">
          AUTHENTICATION REQUIRED
        </h2>
        <p className="text-gray-400 mb-8">
          You must be logged in to register for the Final Selection.
        </p>
        <div className="flex gap-4">
          <motion.button
            whileHover={buttonHover}
            whileTap={buttonTap}
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-prakida-flame text-white font-bold tracking-wider skew-x-[-12deg]"
          >
            <span className="skew-x-[12deg] block">LOGIN</span>
          </motion.button>
          <motion.button
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

  const config = currentConfig;
  const totalTeamSize = 1 + members.length;
  const leadershipEnabled =
    registrationMode === "group" && Boolean(config?.teamNameRequired);

  return (
    <section
      id="register"
      className="py-12 bg-black relative border-t border-white/5"
    >
      <div className="container mx-auto px-4 md:px-6">
        {}
        <motion.div
          variants={sectionSlide}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-10 text-center lg:text-left"
        >
          <h2 className="text-prakida-flame font-bold tracking-[0.2em] mb-2">
            JOIN THE CORPS
          </h2>
          <h3 className="text-3xl md:text-4xl font-display font-bold text-white">
            {registrationMode === "solo" ? "SOLO REGISTRATION" : "TEAM REGISTRATION"}
          </h3>
        </motion.div>

        {status.message && (
          <div
            className={`mb-8 p-4 rounded border text-center font-bold ${status.type === "success" ? "bg-green-900/20 border-green-500/50 text-green-400" : "bg-red-900/20 border-red-500/50 text-red-400"}`}
          >
            {status.message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-8 lg:gap-16"
        >
          {}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Trophy size={64} className="text-prakida-flame" />
              </div>

              <h4 className="text-xl font-display font-bold text-white mb-6 border-b border-white/10 pb-2 flex items-center gap-2">
                <Shield className="text-prakida-flame" size={20} /> MISSION
                DETAILS
              </h4>

              {}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">
                    SELECT SPORT
                  </label>
                  <select
                    value={selectedSport}
                    onChange={handleSportChange}
                    className="w-full bg-black/50 border border-white/10 p-3 text-white focus:outline-none focus:border-prakida-flame transition-colors"
                  >
                    {Object.keys(SPORTS_CONFIG).map((sport) => (
                      <option key={sport} value={sport} className="bg-gray-900">
                        {sport}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">
                    CATEGORY
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 p-3 text-white focus:outline-none focus:border-prakida-flame transition-colors"
                  >
                    {SPORTS_CONFIG[selectedSport].categories.map((cat) => (
                      <option
                        key={cat.id}
                        value={cat.id}
                        className="bg-gray-900"
                      >
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-prakida-water mt-1">
                    Members Required: {config.minPlayers} - {config.maxPlayers}
                  </p>
                  {(config?.registrationFee || config?.prizePool) && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="bg-black/30 border border-white/10 p-2">
                        <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">
                          Fee
                        </div>
                        <div className="text-sm text-white font-bold">
                          {formatRegistrationFee(config) || "—"}
                        </div>
                      </div>
                      <div className="bg-black/30 border border-white/10 p-2">
                        <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">
                          Prize Pool
                        </div>
                        <div className="text-sm text-white font-bold">
                          {formatINRWithSymbol(config?.prizePool) || "—"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {canChooseMode() && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">
                      REGISTRATION TYPE
                    </label>
                    <select
                      value={registrationMode}
                      onChange={(e) => {
                        const next = e.target.value;
                        setRegistrationMode(next);
                        setMembers([]);
                        if (next === "solo") setUserRole("Player");
                        else if (userRole === "Player") setUserRole("Captain");
                      }}
                      className="w-full bg-black/50 border border-white/10 p-3 text-white focus:outline-none focus:border-prakida-flame transition-colors"
                    >
                      <option value="solo" className="bg-gray-900">
                        Solo (Per Head)
                      </option>
                      <option value="group" className="bg-gray-900">
                        Team
                      </option>
                    </select>
                    <p className="text-xs text-gray-400 mt-1">
                      Use <span className="text-white">Solo</span> if you are registering only yourself.
                    </p>
                  </div>
                )}

                {leadershipEnabled ? (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">
                      YOUR ROLE (LEADERSHIP ONLY)
                    </label>
                    <select
                      value={userRole}
                      onChange={(e) => setUserRole(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 p-3 text-prakida-flame font-bold focus:outline-none focus:border-prakida-flame transition-colors"
                    >
                      <option value="Captain" className="bg-gray-900">
                        Captain
                      </option>
                      <option value="Vice-Captain" className="bg-gray-900">
                        Vice-Captain
                      </option>
                    </select>
                  </div>
                ) : null}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">
                    YOUR NAME (REQUIRED)
                  </label>
                  <input
                    type="text"
                    value={registrantName}
                    onChange={(e) => setRegistrantName(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 p-3 text-white focus:outline-none focus:border-prakida-flame"
                    placeholder="ENTER YOUR FULL NAME"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">
                    GENDER (REQUIRED)
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => {
                      const nextGender = e.target.value;
                      setGender(nextGender);
                      // If members don't have a gender chosen yet, default them to the selected team gender.
                      setMembers((prev) =>
                        prev.map((m) => ({
                          ...m,
                          gender: m.gender || nextGender,
                        })),
                      );
                    }}
                    className="w-full bg-black/50 border border-white/10 p-3 text-white focus:outline-none focus:border-prakida-flame transition-colors"
                    required
                  >
                    <option value="" className="bg-gray-900">
                      SELECT GENDER
                    </option>
                    <option value="Male" className="bg-gray-900">
                      Male
                    </option>
                    <option value="Female" className="bg-gray-900">
                      Female
                    </option>
                  </select>
                </div>

                {leadershipEnabled && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">
                      TEAM NAME
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 p-3 text-white focus:outline-none focus:border-prakida-flame"
                      placeholder="ENTER TEAM NAME"
                      required
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">
                    COLLEGE / INSTITUTE
                  </label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 p-3 text-white focus:outline-none focus:border-prakida-flame"
                    placeholder="ENTER COLLEGE NAME"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">
                      YOUR EMAIL (REQUIRED)
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 p-3 text-white focus:outline-none focus:border-prakida-flame"
                      placeholder={user?.email || "EMAIL"}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">
                      YOUR PHONE (REQUIRED)
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 p-3 text-white focus:outline-none focus:border-prakida-flame"
                      placeholder="+91..."
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="lg:w-2/3">
            <div className="mb-6 flex justify-between items-end border-b border-white/10 pb-4">
              <div>
                <h4 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <Users className="text-prakida-flame" size={20} /> SQUAD
                  ROSTER
                </h4>
                <p className="text-gray-400 text-sm mt-1">
                  {totalTeamSize} / {config.maxPlayers} SLOTS FILLED
                </p>
              </div>

              {registrationMode === "group" && totalTeamSize < config.maxPlayers && (
                <motion.button
                  type="button"
                  onClick={addMember}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-sm font-bold border border-white/10 transition-colors"
                >
                  <Plus size={16} /> ADD MEMBER
                </motion.button>
              )}
            </div>

            <div className="space-y-4">
              {}
              <div className="bg-prakida-flame/10 border border-prakida-flame/30 p-4 flex flex-col md:flex-row gap-4 items-center relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-prakida-flame"></div>
                <span className="text-prakida-flame font-mono text-sm w-8">
                  01
                </span>
                <div className="flex-1 w-full md:w-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-black/30 border border-white/10 p-2 text-gray-400 text-sm flex items-center gap-2">
                    <Crown size={14} className="text-yellow-500" />
                    <span className="sr-only">Primary participant</span>
                    <span className="truncate">{registrantName || "You"}</span>
                  </div>
                  {leadershipEnabled ? (
                    <div className="bg-black/30 border border-white/10 p-2 text-prakida-flame font-bold text-sm">
                      {userRole.toUpperCase()}
                    </div>
                  ) : (
                    <div className="bg-black/30 border border-white/10 p-2 text-prakida-flame font-bold text-sm">
                      PLAYER
                    </div>
                  )}
                  <div className="bg-black/30 border border-white/10 p-2 text-gray-400 text-sm overflow-hidden text-ellipsis">
                    {contactEmail || "No Email"}
                  </div>
                  <div className="bg-black/30 border border-white/10 p-2 text-gray-400 text-sm">
                    {contactPhone || "No Phone"}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {members.map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white/5 border border-white/10 p-4 flex flex-col md:flex-row gap-4 items-start md:items-center relative group"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-prakida-flame/50 group-hover:bg-prakida-flame transition-colors"></div>

                    <span className="text-gray-500 font-mono text-sm w-8">
                      {(index + 2).toString().padStart(2, "0")}
                    </span>

                    <div className="flex-1 w-full md:w-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) =>
                          handleMemberChange(index, "name", e.target.value)
                        }
                        placeholder="PLAYER NAME"
                        className="bg-black/30 border border-white/10 p-2 text-white text-sm focus:border-prakida-flame focus:outline-none w-full"
                        required
                      />
                      {leadershipEnabled ? (
                        <select
                          value={member.role}
                          onChange={(e) =>
                            handleMemberChange(index, "role", e.target.value)
                          }
                          className="bg-black/30 border border-white/10 p-2 text-white text-sm focus:border-prakida-flame focus:outline-none w-full"
                        >
                          <option className="bg-gray-900" value="Player">
                            Player
                          </option>
                          <option className="bg-gray-900" value="Captain">
                            Captain
                          </option>
                          <option className="bg-gray-900" value="Vice-Captain">
                            Vice-Captain
                          </option>
                        </select>
                      ) : (
                        <div className="bg-black/30 border border-white/10 p-2 text-prakida-flame font-bold text-sm">
                          PLAYER
                        </div>
                      )}

                      <select
                        value={member.gender || ""}
                        onChange={(e) =>
                          handleMemberChange(index, "gender", e.target.value)
                        }
                        className="bg-black/30 border border-white/10 p-2 text-white text-sm focus:border-prakida-flame focus:outline-none w-full"
                        required
                      >
                        <option value="" className="bg-gray-900">
                          GENDER (REQ)
                        </option>
                        <option value="Male" className="bg-gray-900">
                          Male
                        </option>
                        <option value="Female" className="bg-gray-900">
                          Female
                        </option>
                      </select>

                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) =>
                          handleMemberChange(index, "email", e.target.value)
                        }
                        placeholder="PLAYER EMAIL (REQ)"
                        className="bg-black/30 border border-white/10 p-2 text-white text-sm focus:border-prakida-flame focus:outline-none w-full"
                        required
                      />
                      <input
                        type="text"
                        value={member.contact}
                        onChange={(e) =>
                          handleMemberChange(index, "contact", e.target.value)
                        }
                        placeholder={
                          member.role === "Player"
                            ? "PHONE (OPTIONAL)"
                            : "PHONE (REQUIRED)"
                        }
                        className={`bg-black/30 border border-white/10 p-2 text-white text-sm focus:border-prakida-flame focus:outline-none w-full ${(member.role === "Captain" || member.role === "Vice-Captain") && !member.contact ? "border-red-500/50" : ""}`}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="text-gray-600 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-8">
              <motion.button
                whileHover={buttonHover}
                whileTap={buttonTap}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-prakida-flame hover:bg-prakida-flameDark text-white font-bold py-4 tracking-[0.25em] disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? "TRANSMITTING DATA..." : "CONFIRM REGISTRATION"}
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Registration;
