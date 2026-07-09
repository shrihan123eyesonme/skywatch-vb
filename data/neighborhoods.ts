// Seeded Virginia Beach neighborhood list used until the real `neighborhoods`
// Supabase table is populated (see supabase/migrations/0001_init.sql).
//
// flood_sensitivity is a 1-5 baseline used only to break ties between
// neighborhoods that are similar distances from the tide gauge / storm
// track — it is NOT an official flood zone rating. Sourced from:
// - City of Virginia Beach Public Works stormwater program & "Ripple Effect"
//   blog (pw.virginiabeach.gov/stormwater)
// - City's ~$489M Windsor Woods / Princess Anne Plaza / The Lakes flood
//   protection "mega bundle" project
// - WHRO reporting on Lynnhaven Inlet surge barrier (Apr 2026) and Lake
//   Bradford/Chubb Lake capital project
// - 1962 Ash Wednesday storm damage history for Sandbridge
// Checked 2026-07-09. Coordinates are neighborhood centroids from
// OpenStreetMap/Nominatim, not parcel-level.

export type Neighborhood = {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  /** 1 (least tide/surge-sensitive) to 5 (most) — a rough local baseline, not an official rating */
  floodSensitivity: 1 | 2 | 3 | 4 | 5;
  description: string;
};

export const neighborhoods: Neighborhood[] = [
  {
    slug: "sandbridge",
    name: "Sandbridge",
    lat: 36.741,
    lng: -75.9398,
    floodSensitivity: 5,
    description:
      "A barrier-spit beach community with a long history of storm damage, including the 1962 Ash Wednesday storm that damaged or destroyed nearly every oceanfront home here. Ongoing beach renourishment helps, but Sandbridge takes the brunt of nor'easters and hurricane surge first.",
  },
  {
    slug: "oceanfront",
    name: "Oceanfront / Resort Strip",
    lat: 36.8508,
    lng: -75.9773,
    floodSensitivity: 4,
    description:
      "The low-lying beachfront tourist corridor is the city's primary coastal storm-surge exposure zone, right along the ocean.",
  },
  {
    slug: "croatan",
    name: "Croatan",
    lat: 36.8233,
    lng: -75.9735,
    floodSensitivity: 4,
    description:
      "An oceanfront neighborhood south of Rudee Inlet that shares Sandbridge's exposure to storm surge and nor'easter wave action.",
  },
  {
    slug: "chesapeake-beach",
    name: "Chesapeake Beach / Chic's Beach",
    lat: 36.9154,
    lng: -76.1202,
    floodSensitivity: 4,
    description:
      "A low-lying Chesapeake Bay-front community along Shore Drive. The city has flagged this corridor, along with Bayville and North Beach, as a repetitive-flooding project area.",
  },
  {
    slug: "ocean-park",
    name: "Ocean Park",
    lat: 36.9093,
    lng: -76.1013,
    floodSensitivity: 4,
    description:
      "Near the Lesner Bridge on the Shore Drive corridor; the city specifically names this area, along with Back Bay and the Lynnhaven Inlet, as coastal-flooding-vulnerable.",
  },
  {
    slug: "bayville",
    name: "Bayville / Church Point / Thoroughgood",
    lat: 36.8976,
    lng: -76.1234,
    floodSensitivity: 3,
    description:
      "Stormwater here drains into Lake Bradford and Chubb Lake. A city capital project targets 'repetitive residential and roadway flooding' from both heavy rain and tidal events in this area.",
  },
  {
    slug: "windsor-woods",
    name: "Windsor Woods",
    lat: 36.8296,
    lng: -76.1005,
    floodSensitivity: 4,
    description:
      "One of three neighborhoods in the city's roughly $489M flood-protection 'mega bundle.' The first of three planned tide gates for this area was completed in fall 2025.",
  },
  {
    slug: "princess-anne-plaza",
    name: "Princess Anne Plaza",
    lat: 36.8318,
    lng: -76.0897,
    floodSensitivity: 4,
    description:
      "Also part of the city's mega-bundle flood-protection project; nearby Bow Creek Golf Course is being converted into a park with built-in stormwater storage.",
  },
  {
    slug: "the-lakes",
    name: "The Lakes",
    lat: 36.8058,
    lng: -76.0858,
    floodSensitivity: 4,
    description:
      "The third neighborhood in the city's flood-protection mega-bundle — low-lying and subject to both tidal and heavy-rain flooding.",
  },
  {
    slug: "lynnhaven",
    name: "Lynnhaven",
    lat: 36.8376,
    lng: -76.0685,
    floodSensitivity: 4,
    description:
      "Repeated tidal flooding has been reported here by local news. The city is moving forward on a proposed flood surge barrier at the Lynnhaven Inlet.",
  },
  {
    slug: "little-neck",
    name: "Little Neck",
    lat: 36.8679,
    lng: -75.9993,
    floodSensitivity: 3,
    description:
      "A peninsula between Linkhorn Bay and Broad Bay, within the low-lying Lynnhaven watershed the city has flagged as high-impact for tidal flooding.",
  },
  {
    slug: "kempsville",
    name: "Kempsville",
    lat: 36.8268,
    lng: -76.1602,
    floodSensitivity: 2,
    description:
      "Farther from the coast, but the city names Kempsville's dense pavement and development as a top example of street-level flooding when storm drains are overwhelmed by heavy rain.",
  },
  {
    slug: "town-center",
    name: "Town Center",
    lat: 36.8435,
    lng: -76.1368,
    floodSensitivity: 2,
    description:
      "Also cited by the city as an example of urban flash flooding driven by paved surfaces during heavy rain, separate from tidal/coastal risk.",
  },
  {
    slug: "pungo",
    name: "Pungo / Blackwater",
    lat: 36.7235,
    lng: -76.0177,
    floodSensitivity: 3,
    description:
      "Rural southern Virginia Beach along the North Landing River. The city is raising Pungo Ferry Road to address recurring flooding and sea-level rise in this area.",
  },
];

export function nearestNeighborhood(lat: number, lng: number): Neighborhood {
  let closest = neighborhoods[0];
  let closestDist = Infinity;
  for (const n of neighborhoods) {
    const d = (n.lat - lat) ** 2 + (n.lng - lng) ** 2;
    if (d < closestDist) {
      closestDist = d;
      closest = n;
    }
  }
  return closest;
}
