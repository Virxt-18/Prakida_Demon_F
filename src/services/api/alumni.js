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
                "Alumni API route not found (404). Set VITE_API_BASE_URL to your backend (or configure a Vite dev proxy for /alumni).";
        }
 
        throw new ApiError(message, { status: response.status, payload });
    }

    return payload;
};

export const alumniService = {
    async registerAlumni({ name, yearOfPassing, phone, email, size }) {
        return await apiFetch(`/alumni/register`, {
            method: "POST",
            body: { name, yearOfPassing, phone, email, size },
        });
    },

    async getStatus() {
        return await apiFetch(`/alumni/status`, { method: "GET" });
    },
};

export { ApiError };
