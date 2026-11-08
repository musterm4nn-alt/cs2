# CS2 asset catalog (index)

The catalog is split into small files so web tools don't cut it off. Read `catalog/zones-roads.md` first, then the
files for the kinds of buildings you need. Every file ends with a line starting `END OF FILE`. If a file you
fetched does not end with that line, it was cut off: fetch it again or in parts. Copy the END OF FILE line of every
file you read completely into your layout's `"catalogMarkers"` list; the validator reports which files you read.

Size = lot width (along the road, the building's front) × lot depth, in 8 m cells.
U = unique, may be placed only once. Placement: road = front edge must touch a road; near_parent = sub-building,
place within the given distance of its parent; water / track / resource / over_road = special sites.
Upgrades with no footprint are listed under their parent at the end of each section.

file | contents | entries | size
---|---|---|---
[catalog/zones-roads.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/main/catalog/zones-roads.md) | zone types, roads, highways, tracks (read this first) | 120 | 11.9 KB
[catalog/services.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/main/catalog/services.md) | Administration, CommunicationsPost, CommunicationsTelecom, Deathcare, DisasterControl, Fire & Rescue, Healthcare, Police, Research | 112 | 12.4 KB
[catalog/education-culture.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/main/catalog/education-culture.md) | Education, SignaturesLandmarks, TouristAttractions | 88 | 10.5 KB
[catalog/parks-parking.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/main/catalog/parks-parking.md) | LargeParks, LargeSportsParks, Parks & Recreation, Pathways, RoadsParking, RoadsServices, SportsParks | 125 | 13.4 KB
[catalog/utilities.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/main/catalog/utilities.md) | Electricity, GarbageManagement, Water & Sewage | 60 | 6.9 KB
[catalog/transport-1.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/main/catalog/transport-1.md) | TransportationAir, TransportationRoad, TransportationSubway, TransportationTram | 84 | 8.6 KB
[catalog/transport-2.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/main/catalog/transport-2.md) | TransportationFerry, TransportationShip, TransportationTrain | 89 | 9.4 KB
[catalog/signatures-residential.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/main/catalog/signatures-residential.md) | SignaturesResidential, SignaturesResidentialMixed | 57 | 7.4 KB
[catalog/signatures-business.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/main/catalog/signatures-business.md) | SignaturesCommercial, SignaturesIndustrial, SignaturesOffice | 117 | 13.4 KB
