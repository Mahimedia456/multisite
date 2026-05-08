import nodemailer from "nodemailer";
import {
  buildActivityEmailHtml,
  buildActivityEmailSubject,
  buildActivityEmailText,
} from "./activityEmailTemplate.js";

let cachedTransporter = null;

function boolEnv(value) {
  return String(value || "").toLowerCase() === "true";
}

function getSmtpConfig() {
  const host =
    process.env.SMTP_HOST ||
    process.env.MAIL_HOST ||
    process.env.EMAIL_HOST ||
    "";

  const port = Number(
    process.env.SMTP_PORT ||
      process.env.MAIL_PORT ||
      process.env.EMAIL_PORT ||
      587
  );

  const user =
    process.env.SMTP_USER ||
    process.env.MAIL_USER ||
    process.env.EMAIL_USER ||
    "";

  const pass =
    process.env.SMTP_PASS ||
    process.env.MAIL_PASS ||
    process.env.EMAIL_PASS ||
    "";

  const secure =
    process.env.SMTP_SECURE !== undefined
      ? boolEnv(process.env.SMTP_SECURE)
      : port === 465;

  const from =
    process.env.SMTP_FROM ||
    process.env.MAIL_FROM ||
    process.env.EMAIL_FROM ||
    user;

  return {
    host,
    port,
    secure,
    user,
    pass,
    from,
  };
}

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const config = getSmtpConfig();

  if (!config.host || !config.user || !config.pass) {
    console.warn("SMTP not configured. Missing SMTP_HOST/SMTP_USER/SMTP_PASS.");
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  return cachedTransporter;
}

export function getActivityRecipients() {
  const raw =
    process.env.ACTIVITY_NOTIFY_EMAILS ||
    process.env.ACTIVITY_NOTIFY_EMAIL ||
    process.env.ADMIN_NOTIFY_EMAILS ||
    process.env.ADMIN_NOTIFY_EMAIL ||
    process.env.NOTIFY_EMAIL ||
    "";

  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function sendActivityNotificationEmail(activity = {}) {
  const transporter = getTransporter();

  if (!transporter) {
    return {
      ok: false,
      skipped: true,
      message: "SMTP transporter not configured.",
    };
  }

  const recipients = getActivityRecipients();

  if (!recipients.length) {
    return {
      ok: false,
      skipped: true,
      message: "No activity notification recipients configured.",
    };
  }

  const config = getSmtpConfig();

  const info = await transporter.sendMail({
    from: config.from,
    to: recipients.join(","),
    subject: buildActivityEmailSubject(activity),
    html: buildActivityEmailHtml(activity),
    text: buildActivityEmailText(activity),
  });

  return {
    ok: true,
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
  };
}