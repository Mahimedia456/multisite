// Browser-safe SDK (NO Node imports)

/**
 * Tenant config used by brand apps
 * - apiBaseUrl:
 *   - If VITE_API_BASE_URL is set -> use it
 *   - else -> use "" (same-origin). This works on Vercel because /api/* is rewritten to your server API.
 */
export function getTenantConfig(tenant) {
  const envBase = import.meta?.env?.VITE_API_BASE_URL;

  return {
    tenant,
    apiBaseUrl: envBase || "", // ✅ default same-origin (uses Vercel rewrites)
    brand: {
      name: tenant?.toUpperCase?.() ?? "Multisite",
      logoType: "material",
      logoValue: "pets",
      homeLinks: [
        { label: "Home", to: "/" },
        { label: "About", to: "/about" },
      ],
      login: { label: "Log In", to: "/login" },
      cta: { label: "Get a Quote", to: "/about" },
    },
  };
}

/**
 * API client
 * - If baseUrl provided -> use it
 * - else if env set -> use it
 * - else -> "" (same-origin)
 */
export function createApiClient({ baseUrl } = {}) {
  const finalBaseUrl = baseUrl ?? (import.meta?.env?.VITE_API_BASE_URL || "");

  async function request(path, options = {}) {
    const url = `${finalBaseUrl}${path}`; // path should start with "/api/..."
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!res.ok) {
      const msg = (data && data.message) || `Request failed: ${res.status}`;
      throw new Error(msg);
    }

    return data;
  }

  return {
    getBrands() {
      return request("/api/brands");
    },

    // (optional) add shared pages endpoints if you use them
    getSharedPageBySlug(slug) {
      return request(`/api/brand_shared_pages/${encodeURIComponent(slug)}`);
    },

    getSharedPageLatest(slug) {
      return request(`/api/brand_shared_pages/${encodeURIComponent(slug)}/latest`);
    },
  };
}
