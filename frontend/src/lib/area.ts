// Maps free-text job locations to Line Map "stations".
// The API has no area field, so this is a best-effort frontend mapping.

// Separators: "·" in Overpass Mono, "∙" (U+2219) in Overpass. Overpass's "·" has zero
// advance width, so " · " renders as "Name ·Place".
export const stations = [
  { id: "downtown", name: "Downtown Toronto", short: "Downtown" },
  { id: "mississauga", name: "Mississauga", short: "Mississauga" },
  { id: "north-york", name: "North York", short: "North York" },
  { id: "markham", name: "Markham", short: "Markham" },
  { id: "vaughan", name: "Vaughan", short: "Vaughan" },
  { id: "oakville", name: "Oakville", short: "Oakville" },
  { id: "remote", name: "Remote ∙ Canada", short: "Remote" },
  { id: "other", name: "Other locations", short: "Other" },
] as const;

export type StationId = (typeof stations)[number]["id"];

// Checked in order: GTA cities first, so "Remote or Mississauga" and
// multi-city lists that include Toronto land on a physical station.
// North York comes before Toronto because it is often written "North York, Toronto".
const cityPatterns: [StationId, RegExp][] = [
  ["north-york", /north york/],
  ["mississauga", /mississauga/],
  ["markham", /markham/],
  ["vaughan", /vaughan/],
  ["oakville", /oakville/],
  ["downtown", /toronto/],
  ["remote", /remote|anywhere|canada|worldwide/],
];

export function getStation(location: string | null | undefined): StationId {
  const normalized = (location ?? "").toLowerCase();
  return cityPatterns.find(([, pattern]) => pattern.test(normalized))?.[0] ?? "other";
}

export function getStationName(id: string) {
  return stations.find((station) => station.id === id)?.name ?? "Unknown station";
}
