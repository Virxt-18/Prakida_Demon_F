import { supabase } from './supabase';

/**
 * TiQR API Client
 * Handles communication with the TiQR Events API.
 * Includes "Mock Mode" for development without live credentials.
 */
class TiQRClient {
    constructor() {
        this.baseUrl = import.meta.env.VITE_TIQR_API_BASE_URL || 'https://api.tiqr.events';
        this.sessionId = import.meta.env.VITE_TIQR_SESSION_ID; // Your static session ID
        this.isMockMode = !import.meta.env.VITE_TIQR_SESSION_ID; // Auto-mock if no ID provided

        if (this.isMockMode) {
            console.warn("⚠️ TiQRClient initialized in MOCK MODE (No VITE_TIQR_SESSION_ID found)");
        }
    }

    /**
     * Authenticate and get temporary access token
     * @returns {Promise<string>} Access Token
     */
    async getAccessToken() {
        if (this.isMockMode) return "mock_access_token_" + Date.now();

        // Check local storage for cached token
        const cached = localStorage.getItem('tiqr_token');
        const expiry = localStorage.getItem('tiqr_token_expiry');
        if (cached && expiry && Date.now() < parseInt(expiry)) {
            return cached;
        }

        try {
            const response = await fetch(`${this.baseUrl}/participant/booking/custom-token/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: this.sessionId })
            });

            if (!response.ok) throw new Error('Failed to generate TiQR token');

            const data = await response.json();
            const token = data.access_token; // Adjust based on actual response structure

            // Cache for ~29 days (safe margin)
            localStorage.setItem('tiqr_token', token);
            localStorage.setItem('tiqr_token_expiry', Date.now() + (29 * 24 * 60 * 60 * 1000));

            return token;
        } catch (error) {
            console.error("TiQR Auth Error:", error);
            throw error;
        }
    }

    /**
     * Create a Booking
     * @param {Object} bookingData - Formatted booking payload
     * @returns {Promise<Object>} Booking response including payment_url
     */
    async createBooking(bookingData) {
        if (this.isMockMode) {
            const mockUid = `mock_uid_${Date.now()}`;
            console.log("Creating Mock Booking with data:", bookingData);
            await new Promise(r => setTimeout(r, 1500)); // Simulate network delay

            return {
                booking_uid: mockUid,
                payment_url: `${window.location.origin}/dashboard?mock_payment_success=true&uid=${mockUid}`, // Redirect back to dashboard
                status: 'pending'
            };
        }

        const token = await this.getAccessToken();

        // Add Webhook Callback URL
        // In Production, this should be your deployed Supabase Function URL
        const callbackUrl = import.meta.env.VITE_TIQR_WEBHOOK_URL || 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/tiqr-webhook';

        const payload = {
            ...bookingData,
            callback_url: callbackUrl
        };

        const response = await fetch(`${this.baseUrl}/participant/booking/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'TiQR Booking Failed');
        }

        return await response.json();
    }
}

export const tiqrClient = new TiQRClient();
