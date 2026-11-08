# CS2 catalog: signatures business (part 3 of 3)

Size = lot width (along the road, the building's front) × lot depth, in 8 m cells.
U = unique, may be placed only once. Placement: road = front edge must touch a road; near_parent = sub-building,
place within the given distance of its parent; water / track / resource / over_road = special sites.
Upgrades with no footprint are listed under their parent at the end of each section.


## SignaturesOffice (continued)

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
auditorium | Auditorium | 12×8 |  | Skyscrapers | near_parent | the_coruna (≤250 m) | 15000 | jobs 20; students 1500
research_wing | Research Wing  | 10×10 | U | Skyscrapers | near_parent | the_coruna (≤200 m) | 30000 | jobs 50; students 1200

- upgrades of `seaworth_building` (no separate placement): `city_hall_pack10_ohsignature01_ext01`
- upgrades of `long_wires_tower` (no separate placement): `communications_array`, `emergency_shelter`, `substation`
- upgrades of `frankfort_court` (no separate placement): `frankfort_court_tower`
- upgrades of `arroyo_seco_building` (no separate placement): `police_headquarters_pack10_ohsignature05_ext01`
- upgrades of `the_coruna` (no separate placement): `university_conversion`

END OF FILE catalog/signatures-business-3.md | 7 entries | check 113122
