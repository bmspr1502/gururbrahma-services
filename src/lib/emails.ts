import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = "drbmsathyaramacharya@gmail.com";
const REPLY_TO_EMAIL = "virudhhiedu.consultant@gmail.com";
const ADMIN_NAME = "Sathya Ram";
const CONTACT_PHONE = "+91 9443514199";
const SITE_URL = "https://gururbrahma.in";

const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/sathyaram.boosimadhavan/",
  whatsapp: "https://wa.me/919443514199",
  youtube: "https://www.youtube.com/@gururbrahma",
  instagram: "https://www.instagram.com/sathyaramacharya_bm/",
};

const EMAIL_STYLE = `
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
`;

const HEADER_STYLE = `
  background-color: #000;
  color: #fff;
  padding: 30px;
  text-align: center;
`;

const CONTENT_STYLE = `
  padding: 30px;
  background-color: #fff;
`;

const FOOTER_STYLE = `
  background-color: #f9f9f9;
  padding: 24px;
  text-align: center;
  font-size: 13px;
  color: #666;
  border-top: 1px solid #eee;
`;

const SOCIAL_LINK_STYLE = `
  display: inline-block;
  margin: 0 10px;
  text-decoration: none;
  color: #FBBD23;
  font-weight: bold;
`;

const GET_FOOTER_HTML = () => `
  <div style="${FOOTER_STYLE}">
    <div style="margin-bottom: 20px;">
      <a href="${
        SOCIAL_LINKS.facebook
      }" style="${SOCIAL_LINK_STYLE}">Facebook</a>
      <a href="${
        SOCIAL_LINKS.whatsapp
      }" style="${SOCIAL_LINK_STYLE}">WhatsApp</a>
      <a href="${SOCIAL_LINKS.youtube}" style="${SOCIAL_LINK_STYLE}">YouTube</a>
      <a href="${
        SOCIAL_LINKS.instagram
      }" style="${SOCIAL_LINK_STYLE}">Instagram</a>
    </div>
    <p style="margin: 0;">&copy; ${new Date().getFullYear()} Gururbrahma Services</p>
    <p style="margin: 5px 0 0 0;">Guiding your spiritual journey through Vedantic traditions.</p>
  </div>
`;

const BUTTON_STYLE = `
  display: inline-block;
  background-color: #FBBD23;
  color: #1A1A1A;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 6px;
  font-weight: bold;
  margin-top: 20px;
`;

const LOGO_PLACEHOLDER = "https://gururbrahma.in/icon.png";

interface EmailParams {
  to: string | string[];
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: EmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[Email] Skipping email send: RESEND_API_KEY not found.");
    return { success: false, error: "API Key missing" };
  }

  try {
    const data = await resend.emails.send({
      from: "Gururbrahma Services <admin@gururbrahma.in>",
      to,
      replyTo: REPLY_TO_EMAIL,
      subject,
      html,
    });

    console.log("[Email] Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("[Email] Error sending email:", error);
    return { success: false, error };
  }
}

export async function sendNewEnquiryEmail(inquiry: any) {
  const adminHtml = `
    <div style="${EMAIL_STYLE}">
      <div style="${HEADER_STYLE}">
        <img src="${LOGO_PLACEHOLDER}" alt="Logo" width="50" height="50" style="margin-bottom: 15px;" />
        <h1 style="margin: 0; font-size: 24px;">New Service Inquiry</h1>
      </div>
      <div style="${CONTENT_STYLE}">
        <p>You have received a new inquiry for <strong>${
          inquiry.serviceName
        }</strong>.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p><strong>Customer Details:</strong></p>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Name:</strong> ${inquiry.name}</li>
          <li><strong>Email:</strong> ${inquiry.email}</li>
          <li><strong>Phone:</strong> ${inquiry.phone}</li>
          <li><strong>Preferred Date:</strong> ${inquiry.preferredDate.toLocaleDateString()} at ${
    inquiry.preferredTime
  }</li>
          ${
            inquiry.rashiNakshatra
              ? `<li><strong>Rashi/Nakshatra:</strong> ${inquiry.rashiNakshatra}</li>`
              : ""
          }
        </ul>
        <p><strong>Additional Details:</strong></p>
        <p style="background: #f5f5f5; padding: 15px; border-radius: 4px; font-style: italic;">
          ${inquiry.description || "No additional details provided."}
        </p>
        <a href="${SITE_URL}/admin/dashboard" style="${BUTTON_STYLE}">View in Dashboard</a>
      </div>
      ${GET_FOOTER_HTML()}
    </div>
  `;

  const userHtml = `
    <div style="${EMAIL_STYLE}">
      <div style="${HEADER_STYLE}">
        <img src="${LOGO_PLACEHOLDER}" alt="Logo" width="50" height="50" style="margin-bottom: 15px;" />
        <h1 style="margin: 0; font-size: 24px;">Inquiry Received</h1>
      </div>
      <div style="${CONTENT_STYLE}">
        <p>Namaste <strong>${inquiry.name}</strong>,</p>
        <p>Thank you for reaching out to Gururbrahma Services. We have received your inquiry for <strong>${
          inquiry.serviceName
        }</strong>.</p>
        <p>We will review your request and contact you shortly to confirm the details.</p>
        <div style="background: #FFF9E6; padding: 20px; border-radius: 8px; border-left: 4px solid #FBBD23; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #856404;">Request Summary</h3>
          <p style="margin-bottom: 5px;"><strong>Service:</strong> ${
            inquiry.serviceName
          }</p>
          <p style="margin-bottom: 5px;"><strong>Scheduled for:</strong> ${inquiry.preferredDate.toLocaleDateString()} at ${
    inquiry.preferredTime
  }</p>
        </div>
        <p>If you have any urgent questions, please feel free to contact us at <strong>${CONTACT_PHONE}</strong> or reply to this email.</p>
        <p>Namaste,<br/><strong>${ADMIN_NAME}</strong></p>
      </div>
      ${GET_FOOTER_HTML()}
    </div>
  `;

  // Send to Admin
  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `[New Inquiry] ${inquiry.serviceName} from ${inquiry.name}`,
    html: adminHtml,
  });

  // Send to User
  await sendEmail({
    to: inquiry.email,
    subject: `Enquiry Received - ${inquiry.serviceName}`,
    html: userHtml,
  });
}

export async function sendStatusUpdateEmail(inquiry: any, newStatus: string) {
  if (newStatus !== "confirmed") return; // Only notify user on confirmation per request

  const html = `
    <div style="${EMAIL_STYLE}">
      <div style="${HEADER_STYLE}">
        <img src="${LOGO_PLACEHOLDER}" alt="Logo" width="50" height="50" style="margin-bottom: 15px;" />
        <h1 style="margin: 0; font-size: 24px;">Booking Confirmed!</h1>
      </div>
      <div style="${CONTENT_STYLE}">
        <p>Namaste <strong>${inquiry.name}</strong>,</p>
        <p>Your request for <strong>${
          inquiry.serviceName
        }</strong> has been <strong>Confirmed</strong>.</p>
        <div style="background: #E6F4EA; padding: 20px; border-radius: 8px; border-left: 4px solid #34A853; margin: 20px 0;">
          <p style="margin-bottom: 5px;"><strong>Service:</strong> ${
            inquiry.serviceName
          }</p>
          <p style="margin-bottom: 0;"><strong>Date & Time:</strong> ${inquiry.preferredDate.toLocaleDateString()} at ${
    inquiry.preferredTime
  }</p>
        </div>
        <p>We look forward to serving you. If there are any changes required, please contact us at <strong>${CONTACT_PHONE}</strong>.</p>
        <p>Namaste,<br/><strong>${ADMIN_NAME}</strong></p>
      </div>
      ${GET_FOOTER_HTML()}
    </div>
  `;

  await sendEmail({
    to: inquiry.email,
    subject: `Booking Confirmed: ${inquiry.serviceName}`,
    html,
  });
}

export async function sendScheduleUpdateEmail(inquiry: any) {
  const html = `
    <div style="${EMAIL_STYLE}">
      <div style="${HEADER_STYLE}">
        <img src="${LOGO_PLACEHOLDER}" alt="Logo" width="50" height="50" style="margin-bottom: 15px;" />
        <h1 style="margin: 0; font-size: 24px;">Schedule Updated</h1>
      </div>
      <div style="${CONTENT_STYLE}">
        <p>Namaste <strong>${inquiry.name}</strong>,</p>
        <p>The schedule for your inquiry <strong>${
          inquiry.serviceName
        }</strong> has been updated by the administrator.</p>
        <div style="background: #EBF5FB; padding: 20px; border-radius: 8px; border-left: 4px solid #3498DB; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #2C3E50;">New Schedule</h3>
          <p style="margin-bottom: 0;"><strong>Date & Time:</strong> ${inquiry.preferredDate.toLocaleDateString()} at ${
    inquiry.preferredTime
  }</p>
        </div>
        <p>If this new time does not work for you, please contact us at <strong>${CONTACT_PHONE}</strong> immediately.</p>
        <p>Namaste,<br/><strong>${ADMIN_NAME}</strong></p>
      </div>
      ${GET_FOOTER_HTML()}
    </div>
  `;

  await sendEmail({
    to: inquiry.email,
    subject: `Schedule Updated: ${inquiry.serviceName}`,
    html,
  });
}
