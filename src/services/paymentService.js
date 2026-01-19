import { tiqrClient } from '../lib/tiqrClient';
import { supabase } from '../lib/supabase';

/**
 * Service for handling Payments (TiQR + Mock)
 */
export const paymentService = {

    /**
     * Initiate a payment session (Booking)
     * @param {Object} bookingData - TiQR payload
     * @returns {Promise<Object>} Response containing payment_url and booking_uid
     */
    async initiatePayment(bookingData) {
        return await tiqrClient.createBooking(bookingData);
    },

    /**
     * Verify payment status locally (Mock Mode Helper)
     * AND handle the self-healing of missing UIDs (from Dashboard)
     * @param {string} uid - Booking UID
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async verifyMockPayment(uid) {
        console.log("Attempting to confirm payment for UID:", uid);

        // 1. Try updating REGISTRATIONS
        let { data, error } = await supabase
            .from('registrations')
            .update({
                payment_status: 'confirmed',
                ticket_pdf_url: 'https://example.com/mock-ticket.pdf',
                payment_amount: 100
            })
            .eq('tiqr_booking_uid', uid)
            .select();

        if (error) console.error("Registrations Update Error:", error);

        // 2. If not found in registrations, try TICKETS
        if (!error && (!data || data.length === 0)) {
            console.log("UID not found in registrations, checking tickets...");
            const ticketUpdate = await supabase
                .from('tickets')
                .update({
                    payment_status: 'confirmed',
                    qr_code_url: 'https://example.com/mock-qr-code.png'
                })
                .eq('tiqr_booking_uid', uid)
                .select();

            data = ticketUpdate.data;
            error = ticketUpdate.error;
        }

        if (error) {
            return { success: false, message: error.message };
        } else if (!data || data.length === 0) {
            return { success: false, message: "No matching record found for UID: " + uid };
        } else {
            return { success: true, message: "Payment Successful" };
        }
    },

    /**
     * Self-heal missing UID (Mock Mode Only)
     * @param {string} table - 'registrations' or 'tickets'
     * @param {string} id - Record ID
     * @returns {Promise<string>} New Mock UID
     */
    async healMissingUid(table, id) {
        const mockUid = `mock_uid_healed_${Date.now()}`;
        const { error } = await supabase
            .from(table)
            .update({ tiqr_booking_uid: mockUid })
            .eq('id', id);

        if (error) throw error;
        return mockUid;
    }
};
