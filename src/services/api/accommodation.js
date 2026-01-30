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
                "Accommodation API route not found (404). Set VITE_API_BASE_URL to your backend (or configure a Vite dev proxy for /accommodation).";
        }

        throw new ApiError(message, { status: response.status, payload });
    }

    return payload;
};

export const accommodationService = {
    async bookAccommodation({ college, teamName, preferences, members } = {}) {
        const parsedEventId = 1;

        const normalizedMembers = (members || []).map((m) => {
            const member = m && typeof m === "object" ? m : {};
            return {
                name: String(member.name || "").trim(),
                email: String(member.email || "").trim(),
                phone: String(member.phone || member.phone_number || "").trim(),
                gender: normalizeGender(member.gender),
            };
        });

        const missingIndex = normalizedMembers.findIndex(
            (m) => !m.name || !m.email || !m.phone || (m.gender !== "M" && m.gender !== "F"),
        );

        if (missingIndex !== -1) {
            throw new ApiError(
                `Member #${missingIndex + 1} must have name, email, phone, and gender (M/F).`,
                { status: 400, payload: { member: normalizedMembers[missingIndex] } },
            );
        }

        return await apiFetch(`/accommodation/book`, {
            method: "POST",
            body: {
                eventId: parsedEventId,
                college,
                teamName,
                preferences,
                members: normalizedMembers,
            },
        });
    },

    async getOrder(id) {
        const safeId = String(id || "").trim();
        if (!safeId) throw new ApiError("Missing booking id", { status: 400 });
        return await apiFetch(`/accommodation/order/${encodeURIComponent(safeId)}`);
    },

    async getAll() {
        return await apiFetch(`/accommodation/all`);
    },
};

export { ApiError };
