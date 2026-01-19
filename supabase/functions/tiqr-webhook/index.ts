import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

console.log("TiQR Webhook Function Initialized")

serve(async (req) => {
    // 1. Validate Method
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 })
    }

    try {
        // 2. Parse Payload
        const payload = await req.json()
        console.log("Received webhook payload:", payload)

        const { booking_uid, status, booking_id, ticket_pdf_url, meta_data } = payload

        if (!booking_uid) {
            return new Response('Missing booking_uid', { status: 400 })
        }

        // 3. Initialize Supabase Admin Client
        // We need SERVICE_ROLE_KEY to bypass RLS and update registrations securely
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        const supabase = createClient(supabaseUrl, supabaseKey)

        // 4. Update Database
        const paymentStatus = (status === 'confirmed' || status === 'paid') ? 'confirmed' : 'failed'
        const updateData = {
            payment_status: paymentStatus,
            tiqr_booking_id: booking_id,
            ticket_pdf_url: ticket_pdf_url || undefined,
            created_via_tiqr: true // Metadata flag
        }

        // Try Registrations First
        const regUpdate = await supabase
            .from('registrations')
            .update(updateData)
            .eq('tiqr_booking_uid', booking_uid)
            .select()

        let successId = regUpdate.data?.[0]?.id
        let tableName = 'registrations'

        // If not found, try Tickets
        if (!successId) {
            console.log("Not found in registrations, checking tickets...")
            // Tickets might have slightly different columns, adjust if needed
            // For tickets, we update payment_status and potentially qr_code_url if provided
            const ticketUpdateData = {
                payment_status: paymentStatus,
                tiqr_booking_id: booking_id,
                qr_code_url: ticket_pdf_url || undefined // Assuming TiQR sends a URL usable for QR
            }

            const ticketUpdate = await supabase
                .from('tickets')
                .update(ticketUpdateData)
                .eq('tiqr_booking_uid', booking_uid)
                .select()

            successId = ticketUpdate.data?.[0]?.id
            tableName = 'tickets'

            if (ticketUpdate.error) {
                console.error("Tickets update error:", ticketUpdate.error)
            }
        }

        if (!successId) {
            console.warn("No registration OR ticket found for UID:", booking_uid)
            return new Response('No matching record found', { status: 404 })
        }

        console.log(`Successfully updated ${tableName}:`, successId)

        return new Response(JSON.stringify({ success: true, id: successId, table: tableName }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (err) {
        console.error("Webhook processing error:", err)
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
    }
})
