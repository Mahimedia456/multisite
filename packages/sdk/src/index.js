export async function getTenantConfig(tenant) {
  // demo config - replace later with API call
  const map = {
    aamir: { tenant: "aamir", primary: "#2ec2b3" },
    umair: { tenant: "umair", primary: "#0b2647" },
    main: { tenant: "main", primary: "#7300e6" }
  };
  return map[tenant] ?? map.main;
}