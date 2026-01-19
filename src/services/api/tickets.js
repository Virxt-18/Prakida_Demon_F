import { supabase } from '../../lib/supabase';

/**
 * Service for handling Event Tickets
 */
export const ticketService = {

    /**
     * Create a pending ticket record
     * @param {Object} ticketData
     * @returns {Promise<Object>} Created ticket
     */
    async createTicket(ticketData) {
        const { data, error } = await supabase
            .from('tickets')
            .insert(ticketData)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update TiQR Booking UID for a ticket
     * @param {string} ticketId 
     * @param {string} bookingUid 
     */
    async updateBookingUid(ticketId, bookingUid) {
        const { error } = await supabase
            .from('tickets')
            .update({ tiqr_booking_uid: bookingUid })
            .eq('id', ticketId);

        if (error) throw error;
    },

    /**
     * Fetch user's tickets
     * @param {string} userId 
     * @returns {Promise<Array>}
     */
    async getUserTickets(userId) {
        const { data, error } = await supabase
            .from('tickets')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Admin: Fetch ALL tickets
     * @returns {Promise<Array>}
     */
    async getAllTickets() {
        const { data, error } = await supabase
            .from('tickets')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Admin: Update payment status
     * @param {string} id - Ticket ID
     * @param {string} status - 'confirmed' | 'pending'
     */
    async updatePaymentStatus(id, status) {
        const { error } = await supabase
            .from('tickets')
            .update({ payment_status: status })
            .eq('id', id);

        if (error) throw error;
    }
};
