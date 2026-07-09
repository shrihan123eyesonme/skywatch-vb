// Seeded aerospace & opportunity hub directory. Real organizations and
// programs, researched 2026-07-09. Mirrors the shape of the `opportunities`
// Supabase table (see supabase/migrations/0001_init.sql) so this can be
// migrated into the DB later without a schema change.

export type Audience = "kids" | "students" | "job-seekers" | "educators" | "everyone";

export type Opportunity = {
  id: string;
  category: "visit" | "event" | "job" | "internship" | "education";
  orgName: string;
  title: string;
  description: string;
  url: string;
  audience: Audience[];
};

export const opportunities: Opportunity[] = [
  {
    id: "nasa-langley",
    category: "visit",
    orgName: "NASA Langley Research Center",
    title: "NASA's oldest field center, right here in Hampton",
    description:
      "You can't just walk onto the base, but NASA periodically holds free public open house events with wind tunnels, historic sites, food trucks, and kids' activities. The everyday visitor experience is the Virginia Air & Space Science Center in downtown Hampton — NASA Langley's official visitor center, with 30+ historic aircraft, an Apollo 12 Command Module, and an IMAX theater.",
    url: "https://www.nasa.gov/langley/",
    audience: ["kids", "students", "educators", "everyone"],
  },
  {
    id: "virginia-air-space-center",
    category: "visit",
    orgName: "Virginia Air & Space Science Center",
    title: "NASA Langley's official visitor center in downtown Hampton",
    description:
      "30+ historic aircraft, an Apollo 12 Command Module, and an IMAX theater — about 35 minutes from Virginia Beach over the water.",
    url: "https://vasc.org/",
    audience: ["kids", "students", "everyone"],
  },
  {
    id: "wallops-visitor-center",
    category: "visit",
    orgName: "NASA Wallops Flight Facility",
    title: "Watch a real rocket launch from 7 miles away",
    description:
      "NASA's rocket range on Virginia's Eastern Shore has a free public visitor center with a launch-viewing area, bleacher seating, and live launch-control audio during actual launches. Open to the public Thursday–Saturday, 10 a.m.–3 p.m. It's about a 2.5-hour drive from Virginia Beach, but worth it for launch day.",
    url: "https://www.nasa.gov/wallops/visitor-center/",
    audience: ["kids", "students", "educators", "everyone"],
  },
  {
    id: "nas-oceana-air-show",
    category: "event",
    orgName: "NAS Oceana",
    title: "NAS Oceana Air Show — free, and the Blue Angels fly",
    description:
      "Virginia Beach is home to the Navy's East Coast Master Jet Base. The public draw is the annual free NAS Oceana Air Show, with the Blue Angels performing. The 2026 show is confirmed for September 19–20, with the Blue Angels flying at 3 p.m. both days.",
    url: "https://www.oceanaairshow.com/",
    audience: ["kids", "students", "everyone"],
  },
  {
    id: "military-aviation-museum",
    category: "visit",
    orgName: "Military Aviation Museum",
    title: "Flyable WWI & WWII warbirds on a grass airstrip in Pungo",
    description:
      "A large private museum of flyable vintage warbirds in rural Virginia Beach. Open daily, 9 a.m.–5 p.m. (closed Thanksgiving and Christmas). About $17 for adults, $10 for youth ages 5-13, free for kids 4 and under.",
    url: "https://www.militaryaviationmuseum.org/hours-tickets-directions/",
    audience: ["kids", "students", "everyone"],
  },
  {
    id: "larss-internship",
    category: "internship",
    orgName: "NASA / National Institute of Aerospace",
    title: "Paid NASA summer internship for local students (LARSS)",
    description:
      "The Langley Aerospace Research Student Scholars program is a real, paid 10-week NASA summer internship for rising juniors, seniors, and grad students in STEM fields (and some non-STEM support roles). Stipend is roughly $5,000-$6,000; requires a 3.0+ GPA and US citizenship. Hosts 200+ interns a year.",
    url: "https://www.nasa.gov/offices/education/programs/descriptions/Langley_Aerospace_Research_Student_Scholars_Project_prt.htm",
    audience: ["students", "job-seekers"],
  },
  {
    id: "virginia-space-grant",
    category: "education",
    orgName: "Virginia Space Grant Consortium",
    title: "Free STEM scholarships, fellowships, and paid internships for VA students",
    description:
      "Hampton-based nonprofit funded by NASA. Runs the Commonwealth STEM Industry Internship Program (CSIIP), a free portal matching Virginia STEM college students with paid internships statewide — over $7.2M awarded to 1,733+ students and 6,500+ internship placements so far.",
    url: "https://vsgc.odu.edu/",
    audience: ["students", "educators", "job-seekers"],
  },
  {
    id: "ama-careers",
    category: "job",
    orgName: "Analytical Mechanics Associates (AMA)",
    title: "A major local aerospace employer most residents have never heard of",
    description:
      "Founded in 1962, headquartered in Hampton right next to NASA Langley. Holds a NASA Langley research and engineering services contract worth up to roughly $1.5B over 8 years — one of the region's largest aerospace employers.",
    url: "https://www.ama-inc.com/",
    audience: ["job-seekers", "students"],
  },
  {
    id: "asrc-federal-careers",
    category: "job",
    orgName: "ASRC Federal",
    title: "Federal contractor with NASA Langley and Langley Air Force Base work",
    description:
      "A federal contractor with confirmed work supporting NASA Langley and Air Combat Command at nearby Langley Air Force Base in Hampton.",
    url: "https://www.asrcfederal.com/",
    audience: ["job-seekers"],
  },
  {
    id: "peraton-careers",
    category: "job",
    orgName: "Peraton",
    title: "Contractor supporting NASA's Wallops sounding-rocket program",
    description:
      "Holds the NASA Sounding Rocket Operations Contract — directly relevant to the sounding-rocket launches you can track at Wallops.",
    url: "https://www.peraton.com/",
    audience: ["job-seekers"],
  },
];

export function filterOpportunities(audience?: Audience) {
  if (!audience || audience === "everyone") return opportunities;
  return opportunities.filter((o) => o.audience.includes(audience));
}
