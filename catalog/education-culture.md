# CS2 catalog: education culture

Size = lot width (along the road, the building's front) × lot depth, in 8 m cells.
U = unique, may be placed only once. Placement: road = front edge must touch a road; near_parent = sub-building,
place within the given distance of its parent; water / track / resource / over_road = special sites.
Upgrades with no footprint are listed under their parent at the end of each section.


## Education

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
chinese_high_school | Chinese High School | 13×11 |  | Dragon Gate | road |  | 30000 | jobs 80; students 800
city_elementary_school | City Elementary School | 6×8 |  |  | road |  | 17500 | jobs 50; range m 3500; students 1500
city_high_school | City High School | 12×6 |  |  | road |  | 22500 | jobs 40; students 800
college | College | 22×16 |  |  | road |  | 75000 | jobs 100; students 10000
community_elementary_school | Community Elementary School | 7×5 |  | Modern Architecture | road |  | 6000 | jobs 30; range m 2000; students 600
elementary_school | Elementary School | 18×8 |  |  | road |  | 12500 | jobs 50; range m 3500; students 1000
high_school | High School | 22×16 |  |  | road |  | 22500 | jobs 80; students 800
medical_university | Medical University | 62×18 | U |  | road |  | 120000 | jobs 150; students 15000
mediterranean_elementary_school | Mediterranean Elementary School | 10×5 |  | Mediterranean Heritage | road |  | 10000 | jobs 50; range m 3500; students 1000
mediterranean_high_school | Mediterranean High School | 9×7 |  | Mediterranean Heritage | road |  | 30000 | jobs 40; students 800; attract 10
modern_community_college | Modern Community College | 20×8 |  | Modern Architecture | road |  | 40000 | jobs 24; students 5000
modern_high_school | Modern High School | 12×6 |  | Modern Architecture | road |  | 50000 | jobs 130; students 1750
modern_technical_university | Modern Technical University | 24×16 | U | Modern Architecture | road |  | 63600 | jobs 100; students 9850
modern_university | Modern University | 16×8 |  | Modern Architecture | road |  | 50000 | jobs 85; students 8500
small_elementary_school | Small Elementary School | 9×6 |  |  | road |  | 5000 | jobs 20; range m 1500; students 400
small_high_school | Small High School | 12×8 |  |  | road |  | 11250 | jobs 20; students 400
technical_university | Technical University | 53×38 | U |  | road |  | 80000 | jobs 150; students 15000
university | University | 40×28 |  |  | road |  | 100000 | jobs 170; students 15000
urban_elementary_school | Urban Elementary School | 7×7 |  | Urban Promenades | road |  | 14000 | jobs 50; range m 4000; students 1200
urban_high_school | Urban High School | 9×8 |  | Urban Promenades | road |  | 20000 | jobs 60; students 800
academy_building | Academy Building | 4×6 |  | Modern Architecture | near_parent | modern_university (≤200 m) | 10000 | jobs 24; students 2000
additional_teaching_building | Additional Teaching Building | 6×4 |  | Modern Architecture | near_parent | modern_high_school (≤88 m) | 20000 | jobs 85; students 1000
college_dormitory | College Dormitory | 10×5 |  | Modern Architecture | near_parent | modern_community_college (≤96 m) | 12000 | jobs 32; students 800
college_library | College Library | 10×8 |  |  | near_parent | college (≤100 m) | 25000 | jobs 24
community_playground | Community Playground | 7×5 |  | Modern Architecture | near_parent | community_elementary_school (≤88 m) | 5000 | jobs 4; attract 15
elementary_school_childrens_clinic | Elementary School Childrens Clinic | 6×8 |  |  | near_parent | elementary_school (≤60 m) | 5000 | jobs 15
elementary_school_playground | Elementary School Playground | 6×4 |  |  | near_parent | elementary_school (≤60 m) | 2500 | attract 1; wellbeing +1 within 300 m
extension_wing | Extension Wing | 3×9 |  |  | near_parent | small_elementary_school (≤60 m) | 1000 | jobs 5; students 100
extension_wing_highschool02_classroom_extension_building | Extension Wing | 6×6 |  |  | near_parent | small_high_school (≤60 m) | 3000 | jobs 5; students 100
gymnasium | Gymnasium | 6×11 |  |  | near_parent | small_elementary_school (≤60 m) | 2000 | jobs 5; attract 1; wellbeing +1 within 200 m
high_school_sports_field | High School Sports Field | 26×20 |  |  | near_parent | high_school (≤100 m) | 7500 | jobs 16; attract 25; wellbeing +4 within 500 m
high_school_sports_park | High School Sports Park | 13×24 |  |  | near_parent | small_high_school (≤60 m) | 1500 | jobs 5; attract 10; wellbeing +3 within 300 m
lecture_hall | Lecture Hall | 10×12 |  | Modern Architecture | near_parent | modern_technical_university (≤200 m) | 25000 | jobs 12; students 500
medical_university_practice_clinic | Medical University Practice Clinic | 15×7 |  |  | near_parent | medical_university (≤120 m) | 50000 | jobs 40; patients 100
medical_university_research_facilities | Medical University Research Facilities | 16×8 |  |  | near_parent | medical_university (≤120 m) | 75000 | jobs 70
sports_field | Sports Field | 20×12 |  | Modern Architecture | near_parent | modern_community_college (≤200 m) | 7500 | jobs 20; attract 25
student_dormitory | Student Dormitory | 6×4 |  | Modern Architecture | near_parent | modern_high_school (≤88 m) | 5000 | jobs 20; students 200
technical_academy_building | Technical Academy Building | 4×12 |  | Modern Architecture | near_parent | modern_technical_university (≤250 m) | 22500 | jobs 28; students 2110
university_library | University Library | 12×12 |  |  | near_parent | university (≤100 m) | 47500 | jobs 50
university_library_rs_university01_sub01 | University Library | 8×10 |  | Modern Architecture | near_parent | modern_university (≤200 m) | 70000 | jobs 16; students 8500
university_park | University Park | 18×18 |  |  | near_parent | university (≤100 m) | 20000 | jobs 20; attract 10; wellbeing +4 within 500 m

- upgrades of `mediterranean_high_school` (no separate placement): `additional_floor`
- upgrades of `college` (no separate placement): `college_extension_wing`
- upgrades of `city_elementary_school` (no separate placement): `courtyard_playground`, `extension_floors`
- upgrades of `elementary_school` (no separate placement): `elementary_school_extension_wing`
- upgrades of `city_high_school` (no separate placement): `extension_floors_highschool03_extension_floors`, `rooftop_sports_park`
- upgrades of `mediterranean_elementary_school` (no separate placement): `extension_wing_ccp5_elementaryschool_ext01`
- upgrades of `chinese_high_school` (no separate placement): `extension_wing_ccp6_servicebuilding04_ext01`
- upgrades of `modern_community_college` (no separate placement): `extension_wing_rs_college01_ext01`
- upgrades of `community_elementary_school` (no separate placement): `extension_wing_rs_elementaryschool01_ext01`
- upgrades of `modern_technical_university` (no separate placement): `extension_wing_rs_techuniversity01_ext02`, `extension_wing_rs_techuniversity01_ext03`, `modern_student_plaza`
- upgrades of `modern_university` (no separate placement): `extension_wing_rs_university01_ext01`
- upgrades of `urban_elementary_school` (no separate placement): `extension_wing_ubpr_elementaryschool01_ext01`, `urban_playground`
- upgrades of `urban_high_school` (no separate placement): `extension_wing_ubpr_highschool01_ext01`, `gym_extension`
- upgrades of `high_school` (no separate placement): `high_school_extension_wing`, `high_school_library`
- upgrades of `medical_university` (no separate placement): `medical_university_extension_wing`
- upgrades of `modern_high_school` (no separate placement): `mindfulness_room`
- upgrades of `technical_university` (no separate placement): `technical_university_extension_wing`, `technical_university_workshop_upgrade`
- upgrades of `university` (no separate placement): `university_extension_wing`

## SignaturesLandmarks

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
bell_tower_of_xi_an | Bell Tower of Xi'an  | 16×16 | U | Landmark Buildings | road |  | 280000 | jobs 40; range m 10000; attract 125
botanical_garden | Botanical Garden | 12×16 | U | Landmark Buildings | road |  | 80000 | jobs 40; range m 10000; attract 125
ferris_wheel | Ferris Wheel | 20×16 | U | Landmark Buildings | road |  | 560000 | jobs 18; range m 6000; attract 110
fountain_plaza | Fountain Plaza | 14×14 | U | CS1 owner reward | road |  | 80000 | jobs 12; range m 7500; attract 100
grand_hotel | Grand Hotel | 14×10 | U | Landmark Buildings | road |  | 80000 | jobs 50; range m 10000; attract 115
namdaemun | Namdaemun | 14×14 | U | Landmark Buildings | road |  | 280000 | jobs 40; range m 10000; attract 125
nasinneula | Näsinneula | 18×15 | U | Landmark Buildings | road |  | 240000 | jobs 46; range m 6000; attract 115
national_diet_building | National Diet Building | 33×31 | U | Landmark Buildings | road |  | 280000 | jobs 60; range m 10000; attract 125
national_gallery_of_art | National Gallery of Art | 42×18 | U | Landmark Buildings | road |  | 160000 | jobs 50; range m 7500; attract 120
notre_dame | Notre-Dame | 10×25 | U | Landmark Buildings | road |  | 280000 | jobs 40; range m 7500; attract 175

## TouristAttractions

id | name | size | U | DLC | placement | parent | upkeep/mo | stats
---|---|---|---|---|---|---|---|---
bronze_statue | Bronze Statue | 9×9 | U |  | road |  | 160000 | jobs 20; range m 5000; attract 50
large_chinese_gate | Large Chinese Gate | 1×3 |  | Dragon Gate | road |  | 3000 | range m 7500; attract 5
medieval_castle | Medieval Castle | 26×24 | U | Paradox account reward | road |  | 240000 | jobs 30; range m 7500; attract 85
modern_art_museum | Modern Art Museum | 14×14 | U | Modern Architecture | road |  | 120000 | jobs 16; range m 6000; attract 50
observation_tower | Observation Tower | 19×14 | U |  | road |  | 160000 | jobs 40; range m 7500; attract 40
old_lighthouse | Old Lighthouse | 2×2 | U | Bridges & Ports | road |  | 25000 | jobs 8; range m 3000; attract 75
small_chinese_gate | Small Chinese Gate | 1×2 |  | Dragon Gate | road |  | 2500 | range m 7500; attract 5
traditional_chinese_temple | Traditional Chinese Temple | 7×12 |  | Dragon Gate | road |  | 220000 | jobs 20; range m 7500; attract 50
water_park | Water Park | 12×6 | U |  | road |  | 40000 | jobs 28; range m 5000; attract 75
lighthouse_museum | Lighthouse Museum | 8×3 |  | Bridges & Ports | near_parent | old_lighthouse (≤100 m) | 20000 | jobs 4; attract 20
lighthouse_restaurant | Lighthouse Restaurant | 3×4 |  | Bridges & Ports | near_parent | old_lighthouse (≤100 m) | 20000 | jobs 4; attract 20

END OF FILE catalog/education-culture.md | 88 entries | check 62cde2
