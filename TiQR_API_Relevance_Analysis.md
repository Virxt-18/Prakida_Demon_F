   # TiQR API Integration - Relevance Analysis

## Executive Summary

This document analyzes the relevance of **TiQR Events API** to the **Prakida_Demon** project. After thorough codebase review, the TiQR API is **HIGHLY RELEVANT** and can significantly enhance the current sports tournament registration system by adding payment processing, ticketing, and event management capabilities.

---

## 1. Current Project Overview

### Project Identity
- **Project Name**: Prakida_Demon (package name: `demon-slayer`)
- **Project Type**: Sports Tournament Registration & Management System
- **Primary Purpose**: Multi-sport tournament registration platform for teams and individuals

### Technology Stack
- **Frontend**: React 19.2.0 with Vite
- **Backend/Database**: Supabase (PostgreSQL)
- **UI Libraries**: Framer Motion, Tailwind CSS, Lenis (smooth scrolling)
- **Authentication**: Supabase Auth
- **Email Service**: EmailJS

### Supported Sports & Categories
The system currently supports registrations for:
- **Team Sports**: Football, Cricket, Basketball, Volleyball
- **Racquet Sports**: Lawn Tennis, Badminton, Table Tennis
- **Indoor Sports**: Carrom, Chess
- **E-Sports**: BGMI, Free Fire, Valorant

Each sport has multiple categories (Men's/Women's teams, Singles, Doubles, Mixed Doubles, etc.) with specific team size requirements.

### Current Features

#### Implemented
1. **User Authentication**
   - Sign up/Sign in via Supabase Auth
   - User profile management
   - Session management via `AuthContext`

2. **Team Registration System**
   - Multi-sport registration form (`Registration.jsx`)
   - Team member roster management
   - Role-based system (Captain, Vice-Captain, Player)
   - Team size validation (min/max players per category)
   - Duplicate registration prevention (server-side RPC)
   - Unique team ID generation (`teamname@1234` format)

3. **Data Management**
   - Supabase tables: `registrations`, `team_members`
   - Row Level Security (RLS) policies
   - User dashboard for viewing registered teams

4. **UI/UX**
   - Responsive design with Demon Slayer theme
   - Animated components (Framer Motion)
   - Gallery, Schedule, Sponsors sections
   - Sports showcase with Hashira-themed cards

#### Missing Features (Gaps Identified)
1. ❌ **Payment Processing**: No payment gateway integration
2. ❌ **Registration Fees**: Cannot charge fees for tournament participation
3. ❌ **Ticketing System**: No tickets for spectators/audience
4. ❌ **Event Booking API**: No external booking system integration
5. ❌ **Webhook Support**: No callback mechanism for payment confirmations
6. ❌ **Event Management**: No programmatic event creation
7. ❌ **Ticket PDF Generation**: No automated ticket/invoice generation
8. ❌ **Delegate/VIP Management**: No special guest onboarding system

---

## 2. TiQR API Overview

### What is TiQR Events?
TiQR Events is a RESTful API platform for event management, ticketing, and booking with integrated payment processing.

### Base URL
```
https://api.tiqr.events
```

### API Capabilities

#### 2.1 Authentication
- **Endpoint**: `POST /participant/booking/custom-token/`
- **Method**: Session-based token generation
- **Token Validity**: 30 days
- **Usage**: Bearer token authentication for all API requests

#### 2.2 Booking System
- **Individual Booking**: `POST /participant/booking/`
  - Supports: name, phone, email, ticket selection, quantity
  - Custom metadata support
  - Payment redirect URL generation
  
- **Bulk Booking**: `POST /participant/booking/bulk/`
  - Multiple bookings in single request
  - Cart-based booking model

- **Booking Retrieval**: `GET /participant/booking/:uid/`
  - Full booking details with status
  - Ticket PDF URL
  - Invoice PDF (if applicable)
  - Payment status

#### 2.3 Event Management
- **Create Event**: `POST /organiser/event/`
  - Event details: name, dates, description, venue
  - Online/offline event support
  - Google Maps integration (Place ID)
  - Genre categorization
  - Cover image upload

- **Upload Assets**: 
  - Cover photo: `POST /organiser/media/`
  - Event posters: `POST /organiser/event/{{eventId}}/poster/`

- **Ticket Management**: `POST /organiser/event/{{eventId}}/ticket/`
  - Pricing (in paise: ₹100 = 10000 paise)
  - Ticket limits (total and per-user)
  - Bulk booking support
  - GST configuration
  - Waitlist capability

#### 2.4 Webhooks
- **Callback System**: POST request to provided `callback_url`
- **Payload**: Booking UID, status, quantity, booking ID
- **Use Case**: Real-time registration confirmation, payment status updates

#### 2.5 Complimentary Booking
- **Endpoint**: `POST /organiser/event/{event_id}/booking/`
- **Use Case**: VIP guests, delegates, free registrations
- **No Payment**: Bypasses payment flow while maintaining booking records

---

## 3. Relevance Assessment

### 3.1 Why TiQR API is Relevant

#### ✅ Direct Feature Alignment
1. **Registration Fee Collection**
   - Currently: Free registration, no payment
   - With TiQR: Charge registration fees per team/player
   - Benefit: Monetization, reduce no-shows

2. **Payment Processing**
   - Currently: No payment system
   - With TiQR: Integrated payment gateway with redirect flow
   - Benefit: Secure, PCI-compliant payment handling

3. **Event Ticketing**
   - Currently: No spectator tickets
   - With TiQR: Sell tickets for tournament viewing
   - Benefit: Additional revenue stream

4. **Automated Ticket Generation**
   - Currently: Manual team ID generation only
   - With TiQR: PDF tickets with QR codes
   - Benefit: Professional ticket management, easy verification

5. **Webhook Integration**
   - Currently: No async confirmation system
   - With TiQR: Real-time payment confirmations
   - Benefit: Update Supabase registrations automatically on payment success

#### ✅ Workflow Enhancement

**Current Flow:**
```
User Registration → Supabase Insert → Manual Confirmation
```

**Enhanced Flow with TiQR:**
```
User Registration → Create TiQR Booking → Payment → Webhook → Supabase Update → Ticket Email
```

### 3.2 Use Case Scenarios

#### Scenario 1: Paid Team Registration
**Current**: Teams register for free via Supabase
**With TiQR**: 
1. User completes team form on Prakida
2. System creates TiQR booking with registration fee
3. User redirected to TiQR payment page
4. After payment, webhook updates Supabase registration status
5. User receives ticket PDF via email

#### Scenario 2: Spectator Tickets
**Current**: No spectator access management
**With TiQR**:
1. Create separate TiQR event for tournament viewing
2. Sell spectator tickets via booking API
3. Generate tickets with QR codes for venue entry

#### Scenario 3: Multi-Event Tournament (Delegate Registration)
**Current**: Single registration per team
**With TiQR** (per PDF implementation guideline):
1. Create "Delegate Registration" as private TiQR event
2. Create individual sport events as sub-events
3. On delegate registration confirmation, use complimentary booking API to register for all sub-events
4. Single payment for access to multiple tournaments

#### Scenario 4: VIP/Free Registrations
**Current**: All registrations treated equally
**With TiQR**:
- Use complimentary booking API for:
  - Sponsors
  - Organizing committee
  - Special guests
  - Invitation-only teams

---

## 4. Integration Opportunities

### 4.1 High-Value Integrations

#### A. Payment-Enabled Registration Flow
**File**: `src/components/Registration.jsx`
**Integration Point**: After form validation, before Supabase insert

```javascript
// Pseudocode flow
1. Validate team registration form
2. Calculate registration fee (based on sport/category)
3. Call TiQR API: POST /participant/booking/
   - Map team data to booking payload
   - Set callback_url: `${YOUR_DOMAIN}/api/webhooks/tiqr`
4. Redirect user to payment.url_to_redirect
5. Store pending registration in Supabase (status: 'pending_payment')
6. On webhook confirmation:
   - Update registration status to 'confirmed'
   - Link TiQR booking UID to registration record
```

**Benefits**:
- Secure payment processing
- Reduced no-show rate
- Automated confirmation

#### B. Webhook Handler
**New File**: `src/lib/tiqrWebhook.js` or backend endpoint
**Function**: Process TiQR callback and update Supabase

```javascript
// Webhook handler pseudocode
POST /api/webhooks/tiqr
{
  "booking_uid": "...",
  "booking_status": "confirmed",
  "meta_data": { "team_unique_id": "..." }
}

→ Update registrations table: status = 'confirmed'
→ Send confirmation email with ticket PDF URL
→ Notify team captain
```

**Benefits**:
- Real-time status updates
- Automated confirmation emails
- Audit trail

#### C. Event Management Integration
**Use Case**: Programmatically create tournament events in TiQR
**When**: During tournament setup phase

```javascript
// Create TiQR events for each sport category
for (const sport of SPORTS_CONFIG) {
  await createTiQREvent({
    name: `${sport} Tournament - Prakida 2026`,
    start_date: tournamentStartDate,
    end_date: tournamentEndDate,
    genre: "Competitions",
    address: { place_id: venuePlaceId }
  });
  
  // Create tickets for each category
  for (const category of sport.categories) {
    await createTicket({
      type: `${category.label} Registration`,
      amount: getRegistrationFee(sport, category),
      limit: maxTeams,
      allow_bulk_booking: true
    });
  }
}
```

**Benefits**:
- Centralized event management
- Ticket tracking across platform
- Unified booking system

### 4.2 Data Model Extensions

#### Required Supabase Schema Updates

```sql
-- Add TiQR integration fields to registrations table
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS
  tiqr_booking_uid TEXT,
  tiqr_booking_id TEXT,
  payment_status TEXT DEFAULT 'pending', -- pending, confirmed, failed
  payment_amount DECIMAL(10,2),
  ticket_pdf_url TEXT,
  created_via_tiqr BOOLEAN DEFAULT false;

-- Add index for webhook lookups
CREATE INDEX IF NOT EXISTS idx_registrations_tiqr_uid 
  ON registrations(tiqr_booking_uid);
```

#### New Environment Variables
```env
VITE_TIQR_API_BASE_URL=https://api.tiqr.events
VITE_TIQR_SESSION_ID=your_session_id
TIQR_ACCESS_TOKEN=your_30day_token
TIQR_WEBHOOK_SECRET=webhook_verification_secret
```

### 4.3 Implementation Considerations

#### Authentication Flow
1. **Token Management**: 
   - Generate access token on app initialization
   - Store in secure storage (not localStorage for production)
   - Refresh before 30-day expiry

2. **Error Handling**:
   - Network failures
   - Payment gateway errors
   - Webhook retry mechanism

3. **User Experience**:
   - Loading states during payment redirect
   - Clear payment status in dashboard
   - Ticket download option post-payment

---

## 5. Implementation Recommendations

### Phase 1: Minimal Viable Integration (MVP)
**Timeline**: 1-2 weeks
**Scope**:
1. Set up TiQR authentication
2. Add payment option to registration form
3. Create webhook endpoint (can use Supabase Edge Functions)
4. Update registration status on payment confirmation
5. Display payment status in user dashboard

**Files to Modify**:
- `src/components/Registration.jsx` - Add payment flow
- `src/lib/tiqrClient.js` - New file for TiQR API client
- `src/pages/Dashboard.jsx` - Show payment status
- `supabase/functions/tiqr-webhook/` - Webhook handler

### Phase 2: Enhanced Features
**Timeline**: 2-3 weeks
**Scope**:
1. Ticket PDF display/download
2. Email notifications with ticket links
3. Spectator ticket sales
4. Admin dashboard for payment tracking

### Phase 3: Advanced Features
**Timeline**: 3-4 weeks
**Scope**:
1. Multi-event delegate registration
2. Complimentary booking for VIPs
3. Refund management
4. Analytics and reporting

### Technical Recommendations

1. **API Client Library**: Create a reusable TiQR API client
   ```javascript
   // src/lib/tiqrClient.js
   export class TiQRClient {
     async createBooking(bookingData) { }
     async getBooking(uid) { }
     async createEvent(eventData) { }
     // ... other methods
   }
   ```

2. **Error Handling Strategy**:
   - Fallback to free registration if TiQR unavailable
   - Queue failed webhook requests for retry
   - Log all TiQR API calls for debugging

3. **Security**:
   - Never expose session_id or access_token in client-side code
   - Use Supabase Edge Functions for server-side TiQR API calls
   - Validate webhook signatures
   - Sanitize user input before sending to TiQR

4. **Testing**:
   - Use TiQR sandbox/test environment
   - Test webhook payloads
   - Verify payment flows end-to-end
   - Test error scenarios (payment failures, network issues)

---

## 6. Comparison: Current vs. TiQR-Enhanced

| Feature | Current System | With TiQR Integration |
|---------|---------------|----------------------|
| **Registration** | ✅ Free, instant | ✅ Paid, payment-gated |
| **Payment** | ❌ None | ✅ Integrated gateway |
| **Ticket Generation** | ❌ Manual IDs only | ✅ Automated PDF with QR |
| **Webhooks** | ❌ None | ✅ Real-time callbacks |
| **Event Management** | ❌ Manual | ✅ Programmatic API |
| **Audience Tickets** | ❌ Not supported | ✅ Spectator ticketing |
| **VIP/Free Access** | ❌ All equal | ✅ Complimentary booking |
| **Payment Tracking** | ❌ None | ✅ Full payment history |
| **Refunds** | ❌ Manual | ✅ API-supported |
| **Email Notifications** | ⚠️ Basic (EmailJS) | ✅ Automated with tickets |

---

## 7. Potential Challenges & Solutions

### Challenge 1: Two-System Data Sync
**Issue**: Maintaining data consistency between Supabase and TiQR
**Solution**: 
- Use TiQR booking UID as foreign key in Supabase
- Webhook-driven updates keep systems in sync
- Periodic reconciliation job for missed webhooks

### Challenge 2: Payment Failure Handling
**Issue**: User completes form but payment fails
**Solution**:
- Store pending registration in Supabase
- Allow payment retry via "Complete Payment" button in dashboard
- Auto-expire pending registrations after 24 hours

### Challenge 3: Cost Considerations
**Issue**: TiQR may charge transaction fees
**Solution**:
- Factor fees into registration pricing
- Consider passing fees to user (`fee_paid_by_buyer: true`)
- Provide free registration option for specific scenarios

### Challenge 4: API Rate Limits
**Issue**: TiQR may have rate limits
**Solution**:
- Implement request queuing
- Cache frequently accessed booking data
- Batch operations where possible

---

## 8. Conclusion

### Relevance Rating: ⭐⭐⭐⭐⭐ (5/5)

The **TiQR Events API is highly relevant** to the Prakida_Demon sports tournament registration system. It addresses critical gaps in the current implementation, specifically:

1. ✅ **Payment Processing**: Enables monetization of tournament registrations
2. ✅ **Professional Ticketing**: Automated PDF ticket generation with QR codes
3. ✅ **Event Management**: Programmatic event and ticket creation
4. ✅ **Webhook Integration**: Real-time payment and booking confirmations
5. ✅ **Scalability**: Support for multiple events, ticket types, and payment scenarios

### Recommended Action
**Proceed with TiQR API integration**, starting with Phase 1 (MVP) to add payment-enabled registration. This will provide immediate value while establishing the foundation for advanced features.

### Next Steps
1. Obtain TiQR session_id and API credentials
2. Set up TiQR sandbox environment for testing
3. Design payment flow wireframes
4. Implement Phase 1 MVP integration
5. Test with small user group before full rollout

---

## 9. References

- TiQR API Documentation: `TiQR API Integration (1).pdf`
- Project Codebase: `Prakida_Demon/`
- Key Files:
  - `src/components/Registration.jsx` - Registration form
  - `src/pages/Dashboard.jsx` - User dashboard
  - `supabase_schema.sql` - Database schema
  - `src/lib/sportsConfig.js` - Sports configuration

---

**Document Created**: 2025-01-XX
**Last Updated**: 2025-01-XX
**Status**: Analysis Complete - Ready for Implementation
