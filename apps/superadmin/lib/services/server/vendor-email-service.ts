import { Resend } from "resend";

interface SendVendorCredentialsParams {
  to: string;
  vendorOwnerName: string;
  storeName: string;
  email: string;
  password: string;
}

const DEFAULT_TEST_EMAIL_TO = "info@abijithcb.com";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY ?? process.env.RESEND_SMTP_PASSWORD;
  const fromValue = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const fromEmail = fromValue.includes("@") ? fromValue : `noreply@${fromValue}`;

  if (!apiKey) {
    throw new Error("Resend is not configured. Set RESEND_API_KEY.");
  }

  return {
    resend: new Resend(apiKey),
    fromEmail
  };
}

export async function sendVendorCredentialsEmail(
  params: SendVendorCredentialsParams
) {
  const { resend, fromEmail } = getResendClient();

  const subject = `Your ${params.storeName} vendor account is ready`;
  const text = [
    `Hello ${params.vendorOwnerName},`,
    "",
    `Your vendor account for ${params.storeName} has been created.`,
    "",
    "Login credentials:",
    `Email: ${params.email}`,
    `Password: ${params.password}`,
    "",
    "Please login and change your password after first sign-in.",
    ""
  ].join("\n");

  const html = `
    <div style="margin:0;padding:24px;background:#f3faf5;font-family:Inter,Segoe UI,Arial,sans-serif;color:#0f172a;">
      <div style="max-width:620px;margin:0 auto;border-radius:24px;overflow:hidden;background:linear-gradient(145deg,#ffffff 0%,#f7fff9 38%,#e9fbe9 70%,#d4f7d8 100%);box-shadow:0 24px 70px rgba(16,185,129,0.18),inset 0 1px 0 rgba(255,255,255,0.9);border:1px solid rgba(16,185,129,0.20);">
        <div style="padding:28px 28px 18px;background:radial-gradient(circle at 20% 0%,rgba(16,185,129,0.22) 0%,rgba(255,255,255,0) 48%),radial-gradient(circle at 90% 10%,rgba(167,243,208,0.28) 0%,rgba(255,255,255,0) 42%);">
          <div style="display:inline-block;padding:7px 12px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:.4px;color:#166534;background:rgba(255,255,255,0.78);border:1px solid rgba(16,185,129,0.28);backdrop-filter:blur(5px);">
            Supportta Solutions Private Limited
          </div>
          <h1 style="margin:14px 0 6px;font-size:26px;line-height:1.25;color:#065f46;">Vendor Account Created</h1>
          <p style="margin:0;font-size:15px;color:#14532d;">Welcome to your Supportta vendor onboarding.</p>
        </div>

        <div style="padding:0 28px 28px;">
          <div style="margin:0 0 16px;padding:18px;border-radius:18px;background:linear-gradient(180deg,rgba(255,255,255,0.78),rgba(255,255,255,0.60));border:1px solid rgba(16,185,129,0.18);box-shadow:inset 0 1px 0 rgba(255,255,255,0.92);backdrop-filter:blur(8px);">
            <p style="margin:0 0 10px;font-size:15px;">Hello <strong>${params.vendorOwnerName}</strong>,</p>
            <p style="margin:0;font-size:15px;line-height:1.6;">Your vendor account for <strong>${params.storeName}</strong> has been created successfully.</p>
          </div>

          <div style="padding:18px;border-radius:18px;background:linear-gradient(145deg,#ecfdf3 0%,#d9fbe3 100%);border:1px solid rgba(22,163,74,0.22);box-shadow:0 8px 24px rgba(34,197,94,0.14),inset 0 1px 0 rgba(255,255,255,0.88);">
            <p style="margin:0 0 12px;font-size:13px;text-transform:uppercase;letter-spacing:.7px;color:#166534;font-weight:700;">Login Credentials</p>
            <p style="margin:0 0 8px;font-size:14px;"><strong>Email:</strong> ${params.email}</p>
            <p style="margin:0;font-size:14px;"><strong>Password:</strong> ${params.password}</p>
          </div>

          <p style="margin:16px 0 0;font-size:13px;color:#166534;">Please sign in and change your password after first login.</p>

          <div style="margin-top:22px;padding-top:16px;border-top:1px solid rgba(22,163,74,0.20);font-size:13px;color:#14532d;">
            <p style="margin:0 0 2px;"><strong>Regards,</strong></p>
            <p style="margin:0;font-weight:700;">Abijith CB</p>
            <p style="margin:2px 0 0;">Supportta Solutions Private Limited</p>
          </div>
        </div>
      </div>
    </div>
  `;

  const result = await resend.emails.send({
    from: `Abijith CB - Supportta Solutions Private Limited <${fromEmail}>`,
    to: params.to,
    subject,
    text,
    html
  });

  if (result.error) {
    throw new Error(result.error.message || "Failed to send vendor onboarding email");
  }
}

export async function sendResendTestEmail(to = DEFAULT_TEST_EMAIL_TO) {
  const { resend, fromEmail } = getResendClient();

  const result = await resend.emails.send({
    from: `Abijith CB - Supportta Solutions Private Limited <${fromEmail}>`,
    to,
    subject: "Supportta Resend Test Email",
    html: `
      <div style="margin:0;padding:24px;background:#f3faf5;font-family:Inter,Segoe UI,Arial,sans-serif;color:#0f172a;">
        <div style="max-width:620px;margin:0 auto;border-radius:24px;overflow:hidden;background:linear-gradient(145deg,#ffffff 0%,#f7fff9 38%,#e9fbe9 70%,#d4f7d8 100%);box-shadow:0 24px 70px rgba(16,185,129,0.18),inset 0 1px 0 rgba(255,255,255,0.9);border:1px solid rgba(16,185,129,0.20);">
          <div style="padding:28px;background:radial-gradient(circle at 20% 0%,rgba(16,185,129,0.22) 0%,rgba(255,255,255,0) 48%),radial-gradient(circle at 90% 10%,rgba(167,243,208,0.28) 0%,rgba(255,255,255,0) 42%);">
            <h2 style="margin:0;color:#065f46;">Resend Integration Verified</h2>
            <p style="margin:10px 0 0;color:#14532d;">This is a dedicated test email from MySupporttaShop Superadmin.</p>
            <p style="margin:16px 0 0;color:#14532d;font-size:13px;">Sent by Abijith CB, Supportta Solutions Private Limited.</p>
          </div>
        </div>
      </div>
    `
  });

  if (result.error) {
    throw new Error(result.error.message || "Failed to send test email");
  }

  return { to };
}
