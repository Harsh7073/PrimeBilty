import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

// Load settings from environment variables
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_FROM = process.env.SMTP_FROM || "no-reply@truckbilty.com";

// Setup nodemailer transporter if configured
let transporter: nodemailer.Transporter | null = null;
if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

// Ensure log file paths
const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  try {
    fs.mkdirSync(logDir, { recursive: true });
  } catch (e) {
    // Ignore folder creation error (fallback to current working dir)
  }
}
const emailLogPath = path.join(logDir, "sent_emails.log");
const smsLogPath = path.join(logDir, "sent_sms.log");

function appendLog(filePath: string, text: string) {
  try {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(filePath, `[${timestamp}] ${text}\n----------------------------------------\n`);
  } catch (e) {
    console.error("Failed to write to verification logs:", e);
  }
}

/**
 * Sends a 6-digit OTP verification code via email.
 */
export async function sendEmailOTP(email: string, otp: string): Promise<boolean> {
  const subject = "Verify your TruckBilty Account";
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background-color: #0b0f19; border: 1px solid #1e293b; border-radius: 16px; color: #ffffff; text-align: center;">
      <div style="margin-bottom: 20px;">
        <span style="font-size: 24px; font-weight: bold; color: #3b82f6; letter-spacing: 0.5px;">TruckBilty</span>
      </div>
      <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 10px; color: #f8fafc;">Verify Your Identity</h2>
      <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin-bottom: 25px;">
        Thank you for choosing TruckBilty. Please enter the following 6-digit OTP code to complete your registration. This code is valid for 10 minutes.
      </p>
      <div style="background: linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.1) 100%); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 12px; padding: 15px 30px; display: inline-block; margin-bottom: 25px;">
        <span style="font-size: 32px; font-weight: 800; color: #3b82f6; letter-spacing: 6px;">${otp}</span>
      </div>
      <p style="color: #64748b; font-size: 12px;">
        If you did not request this verification, please ignore this email or contact support.
      </p>
    </div>
  `;

  const logText = `Email: ${email} | OTP: ${otp} | Subject: ${subject}`;
  appendLog(emailLogPath, logText);
  console.log(`[VERIFICATION EMAIL] Pushed to logs/sent_emails.log: ${logText}`);

  if (transporter) {
    try {
      await transporter.sendMail({
        from: SMTP_FROM,
        to: email,
        subject,
        html: htmlContent,
      });
      return true;
    } catch (error) {
      console.error("Nodemailer failed to send email OTP:", error);
      // Fallback to true since we logged it to the log file for local debug
      return true;
    }
  }

  return true;
}

/**
 * Sends a 6-digit OTP verification code via SMS.
 */
export async function sendSMSOTP(phone: string, otp: string): Promise<boolean> {
  const messageText = `Your TruckBilty verification code is: ${otp}. Valid for 10 mins. Please do not share it.`;

  const logText = `Phone: ${phone} | OTP: ${otp} | Message: ${messageText}`;
  appendLog(smsLogPath, logText);
  console.log(`[VERIFICATION SMS] Pushed to logs/sent_sms.log: ${logText}`);

  const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY;
  if (FAST2SMS_API_KEY) {
    try {
      // Clean phone number to be a 10 digit number
      const cleanPhone = phone.replace(/\D/g, "").slice(-10);

      // Using route=q (Quick SMS) which does not require DLT registration or website verification
      const response = await fetch(
        `https://www.fast2sms.com/dev/bulkV2?authorization=${FAST2SMS_API_KEY}&route=q&message=${encodeURIComponent(messageText)}&language=english&numbers=${cleanPhone}`
      );

      const resData = await response.json();
      console.log("[FAST2SMS RESPONSE]:", resData);

      if (resData.return === true) {
        return true;
      } else {
        console.error("Fast2SMS OTP delivery failure:", resData.message);
      }
    } catch (e) {
      console.error("Fast2SMS SMS send failed with error:", e);
    }
  }

  // If you integrate an SMS provider like Twilio, Msg91, etc., implement here:
  const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
  const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const TWILIO_FROM = process.env.TWILIO_FROM;

  if (TWILIO_SID && TWILIO_TOKEN && TWILIO_FROM) {
    try {
      const basicAuth = Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString("base64");
      const body = new URLSearchParams({
        To: phone,
        From: TWILIO_FROM,
        Body: messageText,
      });

      await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });
      return true;
    } catch (e) {
      console.error("Twilio SMS send failed:", e);
    }
  }

  return true;
}
