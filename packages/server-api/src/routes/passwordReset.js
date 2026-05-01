import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const APP_URL = process.env.APP_URL || "http://localhost:5173";
const OTP_EXPIRES_MINUTES = Number(process.env.OTP_EXPIRES_MINUTES || 10);

function makeOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function getMailer() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function passwordResetEmailTemplate({ otp, email }) {
  return {
    subject: "Password Reset Code - Admin Portal",
    html: `
      <div style="margin:0;padding:0;background:#f5f1fb;font-family:Arial,sans-serif;">
        <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
          <div style="background:#ffffff;border-radius:24px;padding:32px;border:1px solid #eee;box-shadow:0 20px 50px rgba(0,0,0,.08);">
            <div style="width:56px;height:56px;border-radius:18px;background:#111827;color:#c4b5fd;display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:24px;">
              🛡️
            </div>

            <h1 style="margin:0;color:#111827;font-size:26px;">Password Reset Code</h1>

            <p style="color:#6b7280;font-size:15px;line-height:1.6;margin-top:12px;">
              We received a request to reset the password for:
              <br />
              <strong style="color:#111827;">${email}</strong>
            </p>

            <div style="margin:28px 0;padding:20px;border-radius:18px;background:#f3f0ff;text-align:center;">
              <div style="font-size:34px;letter-spacing:8px;font-weight:800;color:#6d28d9;">
                ${otp}
              </div>
            </div>

            <p style="color:#6b7280;font-size:14px;line-height:1.6;">
              This code will expire in ${OTP_EXPIRES_MINUTES} minutes.
              If you did not request this, you can safely ignore this email.
            </p>

            <p style="margin-top:28px;color:#9ca3af;font-size:12px;">
              Allianz Admin Portal<br/>
              ${APP_URL}
            </p>
          </div>
        </div>
      </div>
    `,
  };
}

async function sendPasswordResetEmail({ to, otp }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP is not configured");
  }

  const mailer = getMailer();
  const tpl = passwordResetEmailTemplate({ otp, email: to });

  await mailer.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: tpl.subject,
    html: tpl.html,
  });
}

export default function passwordResetRoutes({ pool, wrap }) {
  return (app) => {
    app.post(
      "/admin/forgot-password",
      wrap(async (req, res) => {
        const email = String(req.body?.email || "").trim().toLowerCase();

        if (!email) {
          return res.status(400).json({
            ok: false,
            message: "Email is required",
          });
        }

        const { rows } = await pool.query(
          `SELECT id, email FROM admins WHERE LOWER(email) = $1 LIMIT 1`,
          [email]
        );

        if (!rows.length) {
          return res.json({
            ok: true,
            message: "If this email exists, a verification code has been sent.",
          });
        }

        const admin = rows[0];
        const otp = makeOtp();
        const otpHash = await bcrypt.hash(otp, 10);

        await pool.query(
          `
          INSERT INTO admin_password_otps (admin_id, email, otp_hash, expires_at)
          VALUES ($1, $2, $3, NOW() + ($4 || ' minutes')::interval)
          `,
          [admin.id, String(admin.email).toLowerCase(), otpHash, OTP_EXPIRES_MINUTES]
        );

        await sendPasswordResetEmail({
          to: admin.email,
          otp,
        });

        return res.json({
          ok: true,
          message: "Verification code sent.",
        });
      })
    );

    app.post(
      "/admin/verify-otp",
      wrap(async (req, res) => {
        const email = String(req.body?.email || "").trim().toLowerCase();
        const otp = String(req.body?.otp || "").trim();

        if (!email || !otp) {
          return res.status(400).json({
            ok: false,
            message: "Email and OTP are required",
          });
        }

        const { rows } = await pool.query(
          `
          SELECT id, otp_hash, expires_at, used_at
          FROM admin_password_otps
          WHERE LOWER(email) = $1
          ORDER BY created_at DESC
          LIMIT 1
          `,
          [email]
        );

        const row = rows[0];

        if (!row || row.used_at || new Date(row.expires_at).getTime() < Date.now()) {
          return res.status(400).json({
            ok: false,
            message: "Invalid or expired code",
          });
        }

        const ok = await bcrypt.compare(otp, row.otp_hash);

        if (!ok) {
          return res.status(400).json({
            ok: false,
            message: "Invalid or expired code",
          });
        }

        return res.json({
          ok: true,
          message: "Code verified.",
        });
      })
    );

    app.post(
      "/admin/reset-password",
      wrap(async (req, res) => {
        const email = String(req.body?.email || "").trim().toLowerCase();
        const otp = String(req.body?.otp || "").trim();
        const password = String(req.body?.password || "");

        if (!email || !otp || !password) {
          return res.status(400).json({
            ok: false,
            message: "Email, OTP and password are required",
          });
        }

        if (password.length < 6) {
          return res.status(400).json({
            ok: false,
            message: "Password must be at least 6 characters",
          });
        }

        const { rows } = await pool.query(
          `
          SELECT id, admin_id, otp_hash, expires_at, used_at
          FROM admin_password_otps
          WHERE LOWER(email) = $1
          ORDER BY created_at DESC
          LIMIT 1
          `,
          [email]
        );

        const row = rows[0];

        if (!row || row.used_at || new Date(row.expires_at).getTime() < Date.now()) {
          return res.status(400).json({
            ok: false,
            message: "Invalid or expired code",
          });
        }

        const ok = await bcrypt.compare(otp, row.otp_hash);

        if (!ok) {
          return res.status(400).json({
            ok: false,
            message: "Invalid or expired code",
          });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await pool.query("BEGIN");

        try {
          await pool.query(
            `UPDATE admins SET password_hash = $2 WHERE id = $1`,
            [row.admin_id, passwordHash]
          );

          await pool.query(
            `UPDATE admin_password_otps SET used_at = NOW() WHERE id = $1`,
            [row.id]
          );

          await pool.query("COMMIT");
        } catch (e) {
          await pool.query("ROLLBACK");
          throw e;
        }

        return res.json({
          ok: true,
          message: "Password reset successfully.",
        });
      })
    );
  };
}