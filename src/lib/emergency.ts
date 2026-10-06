const NUMBERS: Record<string, string> = {
  US: "911", CA: "911", MX: "911", GB: "999", IE: "112", AU: "000", NZ: "111",
  IN: "112", LK: "1990", PK: "1122", BD: "999", NP: "100", JP: "119", KR: "119",
  CN: "120", HK: "999", SG: "995", MY: "999", PH: "911", ID: "112", TH: "1669",
  AE: "999", SA: "997", ZA: "10177", NG: "112", KE: "999", BR: "192", AR: "107",
};
const TZ: Record<string, string> = {
  "Asia/Colombo": "LK", "Asia/Kolkata": "IN", "Asia/Calcutta": "IN", "Europe/London": "GB",
  "Australia/Sydney": "AU", "Asia/Tokyo": "JP", "Asia/Singapore": "SG", "Asia/Dubai": "AE",
  "Asia/Karachi": "PK", "Asia/Dhaka": "BD",
};

export function detectCountry(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (TZ[tz]) return TZ[tz];
    if (tz.startsWith("America/") && !tz.includes("Argentina") && !tz.includes("Sao_Paulo")) return "US";
  } catch {}
  const region = (navigator.language.split("-")[1] || "").toUpperCase();
  return region || "";
}

export function emergencyNumber(country: string): string {
  return NUMBERS[country] ?? "112";
}
