# CS2 asset catalog (index)

The catalog is split into files of under 7,000 characters, because web tools may cut longer pages off without
warning (Code Arena's web_fetch stops at 8,000 characters). Read the `zones-roads` files first, then the files for
the kinds of buildings you need. Every file ends with a line starting `END OF FILE`; if a file you fetched does not
end with that line, it was cut off. Copy the END OF FILE line of every file you read completely into your layout's
`"catalogMarkers"` list; the validator reports which files you read.

Size = lot width (along the road, the building's front) × lot depth, in 8 m cells.
U = unique, may be placed only once. Placement: road = front edge must touch a road; near_parent = sub-building,
place within the given distance of its parent; water / track / resource / over_road = special sites.
Upgrades with no footprint are listed under their parent at the end of each section.

file | contents | entries | size
---|---|---|---
[catalog/zones-roads-1.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/v3.1.0/catalog/zones-roads-1.md) | Zones, Roads: small, Roads: medium | 62 | 6.7 KB
[catalog/zones-roads-2.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/v3.1.0/catalog/zones-roads-2.md) | Roads: medium, Roads: large, Roads: highway, Roads: transit lane, Roads: port, Roads: track | 55 | 6.6 KB
[catalog/zones-roads-3.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/v3.1.0/catalog/zones-roads-3.md) | Roads: track | 3 | 0.9 KB
[catalog/services-1.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/v3.1.0/catalog/services-1.md) | Administration, CommunicationsPost, CommunicationsTelecom, Deathcare, DisasterControl, Fire & Rescue | 49 | 6.6 KB
[catalog/services-2.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/v3.1.0/catalog/services-2.md) | Fire & Rescue, Healthcare, Police, Research | 48 | 6.4 KB
[catalog/education-culture-1.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/v3.1.0/catalog/education-culture-1.md) | Education | 49 | 6.7 KB
[catalog/education-culture-2.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/v3.1.0/catalog/education-culture-2.md) | Education, SignaturesLandmarks, TouristAttractions | 31 | 4.5 KB
[catalog/parks-parking-1.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/v3.1.0/catalog/parks-parking-1.md) | LargeParks, LargeSportsParks, Parks & Recreation | 58 | 6.7 KB
[catalog/parks-parking-2.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/v3.1.0/catalog/parks-parking-2.md) | Parks & Recreation, Pathways, RoadsParking | 60 | 6.6 KB
[catalog/parks-parking-3.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/v3.1.0/catalog/parks-parking-3.md) | RoadsServices, SportsParks | 6 | 1.2 KB
[catalog/utilities-1.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/v3.1.0/catalog/utilities-1.md) | Electricity, GarbageManagement, Water & Sewage | 47 | 6.7 KB
[catalog/utilities-2.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/v3.1.0/catalog/utilities-2.md) | Water & Sewage | 3 | 0.9 KB
[catalog/transport-road-air-1.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/v3.1.0/catalog/transport-road-air-1.md) | TransportationAir, TransportationRoad, TransportationSubway | 53 | 6.6 KB
[catalog/transport-road-air-2.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/v3.1.0/catalog/transport-road-air-2.md) | TransportationSubway, TransportationTram | 19 | 2.7 KB
[catalog/transport-rail-water-1.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/v3.1.0/catalog/transport-rail-water-1.md) | TransportationFerry, TransportationShip, TransportationTrain | 49 | 6.7 KB
[catalog/transport-rail-water-2.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/v3.1.0/catalog/transport-rail-water-2.md) | TransportationTrain | 21 | 3.4 KB
[catalog/signatures-residential-1.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/v3.1.0/catalog/signatures-residential-1.md) | SignaturesResidential, SignaturesResidentialMixed | 49 | 6.6 KB
[catalog/signatures-residential-2.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/v3.1.0/catalog/signatures-residential-2.md) | SignaturesResidentialMixed | 7 | 1.4 KB
[catalog/signatures-business-1.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/v3.1.0/catalog/signatures-business-1.md) | SignaturesCommercial, SignaturesIndustrial | 52 | 6.6 KB
[catalog/signatures-business-2.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/v3.1.0/catalog/signatures-business-2.md) | SignaturesIndustrial, SignaturesOffice | 56 | 6.7 KB
[catalog/signatures-business-3.md](https://raw.githubusercontent.com/musterm4nn-alt/cs2/v3.1.0/catalog/signatures-business-3.md) | SignaturesOffice | 7 | 1.3 KB
