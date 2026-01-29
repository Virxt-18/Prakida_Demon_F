import { auth } from "../../lib/firebase";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

class ApiError extends Error {
  constructor(message, { status, payload } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

const getFirebaseIdToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new ApiError("Authentication required", { status: 401 });
  return await user.getIdToken();
};

const safeParseJson = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
};

const normalizeGender = (value) => {
  if (!value) return "";
  const v = String(value).trim().toLowerCase();
  if (v === "m" || v === "male") return "M";
  if (v === "f" || v === "female") return "F";
  return String(value).trim();
};

const apiFetch = async (path, { method = "GET", body } = {}) => {
  const token = await getFirebaseIdToken();
  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await safeParseJson(response);

  if (!response.ok) {
    let message =
      payload?.message || payload?.error || `Request failed (${response.status})`;

    if (response.status === 404 && !API_BASE_URL) {
      message =
        "Events API route not found (404). Set VITE_API_BASE_URL to your backend (or configure a Vite dev proxy for /events).";
    }
    throw new ApiError(message, { status: response.status, payload });
  }

  return payload;
};

export const eventsService = {
  async bookEvent({ eventId, type, members, name, phone, college, role, gender, teamName }) {
    const normalizedGender = normalizeGender(gender);
    if (normalizedGender && normalizedGender !== "M" && normalizedGender !== "F") {
      throw new ApiError("Gender must be M or F.", {
        status: 400,
        payload: { gender },
      });
    }

    const cleanedTeamName =
      typeof teamName === "string" ? teamName.trim() : teamName;

    const normalizedMembers = (members || []).map((m) => {
      const member = m && typeof m === "object" ? m : {};
      const memberGender = normalizeGender(member.gender || normalizedGender);
      return {
        ...member,
        role: member.role || role || "Player",
        gender: memberGender,
      };
    });

    const missingGenderIndex = normalizedMembers.findIndex(
      (m) => !m?.gender || (m.gender !== "M" && m.gender !== "F"),
    );
    if (missingGenderIndex !== -1) {
      throw new ApiError(`Member #${missingGenderIndex + 1} gender must be M or F.`, {
        status: 400,
        payload: { member: normalizedMembers[missingGenderIndex] },
      });
    }

    const body = {
      eventId,
      type,
      members: normalizedMembers,
      name,
      phone,
      college,
      role,
      gender: normalizedGender,
      ...(cleanedTeamName ? { teamName: cleanedTeamName } : {}),
    };

    return await apiFetch(`/events/book`, { method: "POST", body });
  },

  async getEventStatus(eventId) {
    return await apiFetch(`/events/status/${encodeURIComponent(eventId)}`);
  },

  async getRegisteredEvents() {
    return await apiFetch(`/events/registered`);
  },
};

export { ApiError };
