import { supabase } from '../../lib/supabase';

/**
 * Service for handling Team Registrations and Members
 */
export const registrationService = {

    /**
     * Check for duplicate registrations via RPC
     * @param {string[]} emails - List of emails to check
     * @param {string} sport - Sport ID
     * @param {string} category - Category ID
     * @returns {Promise<string[] | null>} List of duplicate emails or null
     */
    async checkDuplicates(emails, sport, category) {
        const { data, error } = await supabase
            .rpc('check_duplicates', {
                _emails: emails,
                _sport: sport,
                _category: category
            });

        if (error) throw error;
        return data; // Returns array of duplicate emails if any
    },

    /**
     * Create a new registration record
     * @param {Object} registrationData 
     * @returns {Promise<Object>} Created registration data
     */
    async createRegistration(registrationData) {
        const { data, error } = await supabase
            .from('registrations')
            .insert(registrationData)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Add members to a registration
     * @param {Array<Object>} membersData 
     * @returns {Promise<void>}
     */
    async addTeamMembers(membersData) {
        const { error } = await supabase
            .from('team_members')
            .insert(membersData);

        if (error) throw error;
    },

    /**
     * Update TiQR Booking UID for a registration
     * @param {string} registrationId 
     * @param {string} bookingUid 
     */
    async updateBookingUid(registrationId, bookingUid) {
        const { error } = await supabase
            .from('registrations')
            .update({ tiqr_booking_uid: bookingUid })
            .eq('id', registrationId);

        if (error) throw error;
    },

    /**
     * Fetch user's dashboard data (Teams they created or are a member of)
     * Handles the complex logic of merging "Created" and "Member" lists
     * @param {Object} user - User object containing email and id
     * @returns {Promise<Array>} Combined and deduplicated registrations
     */
    async getUserRegistrations(user) {
        if (!user?.email) return [];

        // 1. Fetch teams where user is a MEMBER
        const { data: memberData, error: memberError } = await supabase
            .from('team_members')
            .select(`
                id,
                role,
                registrations (
                    id,
                    team_name,
                    sport,
                    category,
                    team_unique_id,
                    payment_status,
                    ticket_pdf_url,
                    tiqr_booking_uid,
                    created_at
                )
            `)
            .ilike('email', user.email);

        if (memberError) console.error("Member fetch error:", memberError);

        // 2. Fetch teams CREATED by the user
        const { data: creatorData, error: creatorError } = await supabase
            .from('registrations')
            .select(`
                id,
                team_name,
                sport,
                category,
                team_unique_id,
                payment_status,
                ticket_pdf_url,
                tiqr_booking_uid,
                created_at
            `)
            .eq('user_id', user.id);

        if (creatorError) console.error("Creator fetch error:", creatorError);

        // 3. Merge and Deduplicate
        const formattedMemberData = (memberData || []).map(m => ({
            id: m.id, // member id (this might be confusing, kept for consistency with original logic, but ideally should be regId)
            member_record_id: m.id,
            role: m.role,
            ...m.registrations
        })).filter(item => item.id); // filter out null registrations

        const formattedCreatorData = (creatorData || []).map(r => ({
            id: r.id, // registration id
            role: 'Captain',
            ...r
        }));

        // Use Map to deduplicate based on team_unique_id
        const combined = new Map();

        formattedMemberData.forEach(item => {
            if (item.team_unique_id) combined.set(item.team_unique_id, item);
        });

        formattedCreatorData.forEach(item => {
            if (item.team_unique_id && !combined.has(item.team_unique_id)) {
                combined.set(item.team_unique_id, item);
            }
        });

        return Array.from(combined.values());
    },

    /**
     * Admin: Fetch ALL registrations
     * @returns {Promise<Array>}
     */
    async getAllRegistrations() {
        const { data, error } = await supabase
            .from('registrations')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Admin: Update payment status
     * @param {string} id - Registration ID
     * @param {string} status - 'confirmed' | 'pending'
     * @param {number} amount - Amount to set
     */
    async updatePaymentStatus(id, status, amount) {
        const { error } = await supabase
            .from('registrations')
            .update({
                payment_status: status,
                payment_amount: amount
            })
            .eq('id', id);

        if (error) throw error;
    }
};
