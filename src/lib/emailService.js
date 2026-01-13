const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;

export const sendRegistrationEmail = async (member, teamDetails) => {
    if (!BREVO_API_KEY) {
        console.warn('Brevo API Key missing. Email not sent.');
        return { status: 'error', message: 'Missing API Key' };
    }

    // Construct Email Content
    const subject = `Registration Confirmed: ${teamDetails.team_name}`;
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
            <h1 style="color: #FF4500;">WELCOME TO THE CORPS</h1>
            <p>Greetings <strong>${member.name}</strong>,</p>
            <p>Your registration for the Final Selection has been confirmed.</p>
            
            <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Team ID:</strong> ${teamDetails.team_unique_id}</p>
                <p><strong>Team Name:</strong> ${teamDetails.team_name}</p>
                <p><strong>Sport:</strong> ${teamDetails.sport.toUpperCase()}</p>
                <p><strong>Category:</strong> ${teamDetails.category.toUpperCase()}</p>
                <p><strong>Your Role:</strong> ${member.role}</p>
            </div>

            <p>Prepare yourself. The event awaits.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #777;">Prakida Demon Corps | Final Selection Committee</p>
        </div>
    `;

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: "Prakida Event Team", email: "prakrida@bitmesra.ac.in" }, // User should verify this sender in Brevo
                to: [{ email: member.email, name: member.name }],
                subject: subject,
                htmlContent: htmlContent
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Brevo API Error');
        }

        console.log(`Brevo Email sent to ${member.email}`);
        return { status: 'success' };

    } catch (error) {
        console.error(`Failed to send email to ${member.email}:`, error);
        return { status: 'error', error };
    }
};

export const sendTeamEmails = async (members, teamDetails) => {
    console.log('Initiating Brevo team emails for:', teamDetails.team_name);
    const emailPromises = members.map(member => sendRegistrationEmail(member, teamDetails));
    return await Promise.all(emailPromises);
};
