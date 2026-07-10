-- Seeds the `neighborhoods` table to match data/neighborhoods.ts so that
-- features needing a real DB row to reference (forum threads tagged to a
-- neighborhood, the Community Impact "neighborhoods watched" stat) have
-- something to point at. Uses `on conflict (slug) do update` so re-running
-- this migration just refreshes the data rather than erroring or duplicating.

insert into public.neighborhoods (slug, name, lat, lng, flood_sensitivity, description)
values
  ('sandbridge', 'Sandbridge', 36.741, -75.9398, 5,
   'A barrier-spit beach community with a long history of storm damage, including the 1962 Ash Wednesday storm that damaged or destroyed nearly every oceanfront home here. Ongoing beach renourishment helps, but Sandbridge takes the brunt of nor''easters and hurricane surge first.'),
  ('oceanfront', 'Oceanfront / Resort Strip', 36.8508, -75.9773, 4,
   'The low-lying beachfront tourist corridor is the city''s primary coastal storm-surge exposure zone, right along the ocean.'),
  ('croatan', 'Croatan', 36.8233, -75.9735, 4,
   'An oceanfront neighborhood south of Rudee Inlet that shares Sandbridge''s exposure to storm surge and nor''easter wave action.'),
  ('chesapeake-beach', 'Chesapeake Beach / Chic''s Beach', 36.9154, -76.1202, 4,
   'A low-lying Chesapeake Bay-front community along Shore Drive. The city has flagged this corridor, along with Bayville and North Beach, as a repetitive-flooding project area.'),
  ('ocean-park', 'Ocean Park', 36.9093, -76.1013, 4,
   'Near the Lesner Bridge on the Shore Drive corridor; the city specifically names this area, along with Back Bay and the Lynnhaven Inlet, as coastal-flooding-vulnerable.'),
  ('bayville', 'Bayville / Church Point / Thoroughgood', 36.8976, -76.1234, 3,
   'Stormwater here drains into Lake Bradford and Chubb Lake. A city capital project targets ''repetitive residential and roadway flooding'' from both heavy rain and tidal events in this area.'),
  ('windsor-woods', 'Windsor Woods', 36.8296, -76.1005, 4,
   'One of three neighborhoods in the city''s roughly $489M flood-protection ''mega bundle.'' The first of three planned tide gates for this area was completed in fall 2025.'),
  ('princess-anne-plaza', 'Princess Anne Plaza', 36.8318, -76.0897, 4,
   'Also part of the city''s mega-bundle flood-protection project; nearby Bow Creek Golf Course is being converted into a park with built-in stormwater storage.'),
  ('the-lakes', 'The Lakes', 36.8058, -76.0858, 4,
   'The third neighborhood in the city''s flood-protection mega-bundle — low-lying and subject to both tidal and heavy-rain flooding.'),
  ('lynnhaven', 'Lynnhaven', 36.8376, -76.0685, 4,
   'Repeated tidal flooding has been reported here by local news. The city is moving forward on a proposed flood surge barrier at the Lynnhaven Inlet.'),
  ('little-neck', 'Little Neck', 36.8679, -75.9993, 3,
   'A peninsula between Linkhorn Bay and Broad Bay, within the low-lying Lynnhaven watershed the city has flagged as high-impact for tidal flooding.'),
  ('kempsville', 'Kempsville', 36.8268, -76.1602, 2,
   'Farther from the coast, but the city names Kempsville''s dense pavement and development as a top example of street-level flooding when storm drains are overwhelmed by heavy rain.'),
  ('town-center', 'Town Center', 36.8435, -76.1368, 2,
   'Also cited by the city as an example of urban flash flooding driven by paved surfaces during heavy rain, separate from tidal/coastal risk.'),
  ('pungo', 'Pungo / Blackwater', 36.7235, -76.0177, 3,
   'Rural southern Virginia Beach along the North Landing River. The city is raising Pungo Ferry Road to address recurring flooding and sea-level rise in this area.')
on conflict (slug) do update set
  name = excluded.name,
  lat = excluded.lat,
  lng = excluded.lng,
  flood_sensitivity = excluded.flood_sensitivity,
  description = excluded.description;
