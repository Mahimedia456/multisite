function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat("de-DE", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Europe/Berlin",
    }).format(new Date(value || Date.now()));
  } catch {
    return new Date(value || Date.now()).toISOString();
  }
}

export function buildActivityEmailSubject(activity = {}) {
  const moduleLabel = activity.module_label || activity.moduleLabel || "Admin";
  const brandName = activity.brand_name || activity.brandName || "Allianz Admin";

  return `[${moduleLabel}] ${brandName}: ${activity.title || "New activity"}`;
}

export function buildActivityEmailHtml(activity = {}) {
  const title = escapeHtml(activity.title || "New admin activity");
  const description = escapeHtml(activity.description || "");
  const brandName = escapeHtml(activity.brand_name || activity.brandName || "-");
  const brandSlug = escapeHtml(activity.brand_slug || activity.brandSlug || "-");
  const moduleLabel = escapeHtml(activity.module_label || activity.moduleLabel || "-");
  const action = escapeHtml(activity.action || "-");
  const actorEmail = escapeHtml(activity.actor_email || activity.actorEmail || "-");
  const actorRole = escapeHtml(activity.actor_role || activity.actorRole || "-");
  const date = escapeHtml(formatDate(activity.created_at || activity.createdAt));
  const appUrl = String(process.env.ADMIN_APP_URL || "").replace(/\/+$/, "");
  const dashboardUrl = appUrl ? `${appUrl}/dashboard` : "";
  const entityPath = activity.meta?.path || activity.path || "";
  const entityUrl = appUrl && entityPath ? `${appUrl}${entityPath}` : dashboardUrl;

  return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f6fa;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <table width="100%" cellspacing="0" cellpadding="0" style="background:#f3f6fa;padding:28px 0;">
      <tr>
        <td align="center">
          <table width="640" cellspacing="0" cellpadding="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:22px;overflow:hidden;border:1px solid #dbe4ee;">
            <tr>
              <td style="background:#007ab3;padding:26px 30px;color:#ffffff;">
                <div style="font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;opacity:.9;">
                  Allianz Admin Activity
                </div>
                <h1 style="margin:10px 0 0;font-size:24px;line-height:32px;font-weight:900;">
                  ${title}
                </h1>
              </td>
            </tr>

            <tr>
              <td style="padding:28px 30px;">
                ${
                  description
                    ? `<p style="margin:0 0 22px;font-size:15px;line-height:24px;color:#475569;font-weight:600;">${description}</p>`
                    : ""
                }

                <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0 10px;">
                  <tr>
                    <td style="width:170px;color:#64748b;font-size:13px;font-weight:800;">Brand / Agency</td>
                    <td style="color:#0f172a;font-size:14px;font-weight:900;">${brandName}</td>
                  </tr>
                  <tr>
                    <td style="width:170px;color:#64748b;font-size:13px;font-weight:800;">Slug</td>
                    <td style="color:#0f172a;font-size:14px;font-weight:700;">${brandSlug}</td>
                  </tr>
                  <tr>
                    <td style="width:170px;color:#64748b;font-size:13px;font-weight:800;">Module</td>
                    <td style="color:#0f172a;font-size:14px;font-weight:900;">${moduleLabel}</td>
                  </tr>
                  <tr>
                    <td style="width:170px;color:#64748b;font-size:13px;font-weight:800;">Action</td>
                    <td style="color:#0f172a;font-size:14px;font-weight:900;">${action}</td>
                  </tr>
                  <tr>
                    <td style="width:170px;color:#64748b;font-size:13px;font-weight:800;">Changed by</td>
                    <td style="color:#0f172a;font-size:14px;font-weight:700;">${actorEmail} (${actorRole})</td>
                  </tr>
                  <tr>
                    <td style="width:170px;color:#64748b;font-size:13px;font-weight:800;">Date</td>
                    <td style="color:#0f172a;font-size:14px;font-weight:700;">${date}</td>
                  </tr>
                </table>

                ${
                  entityUrl
                    ? `
                    <div style="margin-top:28px;">
                      <a href="${escapeHtml(entityUrl)}" style="display:inline-block;background:#007ab3;color:#ffffff;text-decoration:none;padding:13px 20px;border-radius:14px;font-size:14px;font-weight:900;">
                        Open in Admin Panel
                      </a>
                    </div>
                    `
                    : ""
                }
              </td>
            </tr>

            <tr>
              <td style="padding:18px 30px;background:#f8fafc;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;line-height:18px;">
                This is an automatic notification from the Allianz Multisite Admin Panel.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

export function buildActivityEmailText(activity = {}) {
  return [
    `Allianz Admin Activity`,
    ``,
    `Title: ${activity.title || "New activity"}`,
    `Description: ${activity.description || "-"}`,
    `Brand: ${activity.brand_name || activity.brandName || "-"}`,
    `Slug: ${activity.brand_slug || activity.brandSlug || "-"}`,
    `Module: ${activity.module_label || activity.moduleLabel || "-"}`,
    `Action: ${activity.action || "-"}`,
    `Changed by: ${activity.actor_email || activity.actorEmail || "-"} (${activity.actor_role || activity.actorRole || "-"})`,
    `Date: ${activity.created_at || activity.createdAt || new Date().toISOString()}`,
  ].join("\n");
}