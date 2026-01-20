// Browser-safe SDK (NO Node imports)

export function getTenantConfig(tenant) {
  // You can replace this with API call or config map later.
  // For now it returns a safe default structure.
  return {
    tenant,
    apiBaseUrl: import.meta?.env?.VITE_API_BASE_URL ?? "http://localhost:4000",
    brand: {
      name: tenant?.toUpperCase?.() ?? "Multisite",
      logoType: "material",
      logoValue: "pets",
      homeLinks: [
        { label: "Home", to: "/" },
        { label: "About", to: "/about" }
      ],
      login: { label: "Log In", to: "/login" },
      cta: { label: "Get a Quote", to: "/about" }
    }
  };
}

export function createApiClient({ baseUrl }) {
  const finalBaseUrl = baseUrl || (import.meta?.env?.VITE_API_BASE_URL ?? "http://localhost:4000");

  async function request(path, options = {}) {
    const url = `${finalBaseUrl}${path}`;
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      ...options
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
    }
  };
}
