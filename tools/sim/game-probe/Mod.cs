// CS2SimProbe: a measuring mod for calibrating tools/sim/simulate.js against the real game.
//
// It reads Mods/CS2SimProbe/probe_config.txt, and once a city is loaded it:
//   - disables the auto-save system for this session (nothing is ever saved; settings are not changed),
//   - sets the simulation speed,
//   - every N game minutes appends one JSON line to the output file: game time, population, households, workers,
//     jobs, cars on the road by type and by the driver's travel purpose, citizens travelling by purpose, and the
//     game's own city traffic flow %,
//   - after the configured number of game hours, writes "done" and (optionally) quits the game.
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text;
using Colossal.Logging;
using Game;
using Game.Buildings;
using Game.Citizens;
using Game.City;
using Game.Common;
using Game.Companies;
using Game.Modding;
using Game.Net;

using PrefabSystem = Game.Prefabs.PrefabSystem;
using PrefabRef = Game.Prefabs.PrefabRef;
using Game.SceneFlow;
using Game.Simulation;
using Game.Tools;
using Game.Vehicles;
using Unity.Collections;
using Unity.Entities;
using UnityEngine;

namespace CS2SimProbe
{
    public class Mod : IMod
    {
        public static ILog log = LogManager.GetLogger("CS2SimProbe").SetShowsErrorsInUI(false);
        public static string Dir;

        public void OnLoad(UpdateSystem updateSystem)
        {
            if (GameManager.instance.modManager.TryGetExecutableAsset(this, out var asset))
                Dir = Path.GetDirectoryName(asset.path);
            log.Info("OnLoad, folder " + Dir);
            updateSystem.UpdateAt<ProbeSystem>(SystemUpdatePhase.MainLoop);   // runs while paused too, so it can start the clock
        }

        public void OnDispose() { log.Info("OnDispose"); }
    }

    public class ProbeSystem : GameSystemBase
    {
        const float FramesPerDay = 262144f;
        readonly Dictionary<string, string> cfg = new Dictionary<string, string>();
        SimulationSystem sim;
        TimeSystem time;
        TrafficFlowSystem flow;
        CitySystem city;
        EntityQuery qMovingCars, qPersonal, qDelivery, qHouseholds, qWorkers, qCitizens, qCompanies, qTravellers, qParked;
        readonly List<(string, EntityQuery)> qTypes = new List<(string, EntityQuery)>();
        uint startFrame, lastSample, lastScan;
        HashSet<Entity> prevCars = new HashSet<Entity>(), prevTrucks = new HashSet<Entity>(), prevAll = new HashSet<Entity>();
        readonly Dictionary<string, int> starts = new Dictionary<string, int>();
        int truckStarts, allStarts, scans;
        bool started, finished;
        string outPath;

        float F(string k, float d) => cfg.TryGetValue(k, out var v) && float.TryParse(v, NumberStyles.Float, CultureInfo.InvariantCulture, out var f) ? f : d;

        protected override void OnCreate()
        {
            base.OnCreate();
            sim = World.GetOrCreateSystemManaged<SimulationSystem>();
            time = World.GetOrCreateSystemManaged<TimeSystem>();
            flow = World.GetOrCreateSystemManaged<TrafficFlowSystem>();
            city = World.GetOrCreateSystemManaged<CitySystem>();
            var moving = new[] { ComponentType.ReadOnly<CarCurrentLane>() };
            var none = new[] { ComponentType.ReadOnly<ParkedCar>(), ComponentType.ReadOnly<Deleted>(), ComponentType.ReadOnly<Temp>() };
            qMovingCars = GetEntityQuery(new EntityQueryDesc { All = new[] { ComponentType.ReadOnly<Car>(), ComponentType.ReadOnly<CarCurrentLane>() }, None = none });
            qPersonal = GetEntityQuery(new EntityQueryDesc { All = new[] { ComponentType.ReadOnly<PersonalCar>(), ComponentType.ReadOnly<CarCurrentLane>() }, None = none });
            qDelivery = GetEntityQuery(new EntityQueryDesc { All = new[] { ComponentType.ReadOnly<DeliveryTruck>(), ComponentType.ReadOnly<CarCurrentLane>() }, None = none });
            qParked = GetEntityQuery(new EntityQueryDesc { All = new[] { ComponentType.ReadOnly<PersonalCar>(), ComponentType.ReadOnly<ParkedCar>() }, None = new[] { ComponentType.ReadOnly<Deleted>(), ComponentType.ReadOnly<Temp>() } });
            AddType<Taxi>("taxi"); AddType<PublicTransport>("publicTransport"); AddType<CargoTransport>("cargoTransport");
            AddType<GarbageTruck>("garbageTruck"); AddType<PoliceCar>("policeCar"); AddType<Ambulance>("ambulance");
            AddType<FireEngine>("fireEngine"); AddType<Hearse>("hearse"); AddType<PostVan>("postVan");
            AddType<MaintenanceVehicle>("maintenance"); AddType<WorkVehicle>("workVehicle");
            qHouseholds = GetEntityQuery(new EntityQueryDesc { All = new[] { ComponentType.ReadOnly<Household>(), ComponentType.ReadOnly<PropertyRenter>() },
                None = new[] { ComponentType.ReadOnly<TouristHousehold>(), ComponentType.ReadOnly<CommuterHousehold>(), ComponentType.ReadOnly<Deleted>(), ComponentType.ReadOnly<Temp>() } });
            qWorkers = GetEntityQuery(new EntityQueryDesc { All = new[] { ComponentType.ReadOnly<Worker>() }, None = new[] { ComponentType.ReadOnly<Deleted>(), ComponentType.ReadOnly<Temp>() } });
            qCitizens = GetEntityQuery(new EntityQueryDesc { All = new[] { ComponentType.ReadOnly<Citizen>() }, None = new[] { ComponentType.ReadOnly<Deleted>(), ComponentType.ReadOnly<Temp>() } });
            qCompanies = GetEntityQuery(new EntityQueryDesc { All = new[] { ComponentType.ReadOnly<WorkProvider>() }, None = new[] { ComponentType.ReadOnly<Deleted>(), ComponentType.ReadOnly<Temp>() } });
            qTravellers = GetEntityQuery(new EntityQueryDesc { All = new[] { ComponentType.ReadOnly<TravelPurpose>(), ComponentType.ReadOnly<CurrentTransport>() }, None = new[] { ComponentType.ReadOnly<Deleted>(), ComponentType.ReadOnly<Temp>() } });
            ReadConfig();
            Mod.log.Info("ProbeSystem created");
        }

        void AddType<T>(string name)
        {
            qTypes.Add((name, GetEntityQuery(new EntityQueryDesc { All = new[] { ComponentType.ReadOnly<T>(), ComponentType.ReadOnly<CarCurrentLane>() },
                None = new[] { ComponentType.ReadOnly<ParkedCar>(), ComponentType.ReadOnly<Deleted>(), ComponentType.ReadOnly<Temp>() } })));
        }

        void ReadConfig()
        {
            try
            {
                var p = Path.Combine(Mod.Dir ?? ".", "probe_config.txt");
                if (File.Exists(p))
                    foreach (var line in File.ReadAllLines(p))
                    {
                        var i = line.IndexOf('=');
                        if (i > 0 && !line.TrimStart().StartsWith("#")) cfg[line.Substring(0, i).Trim()] = line.Substring(i + 1).Trim();
                    }
                outPath = cfg.TryGetValue("out", out var o) ? o : Path.Combine(Mod.Dir ?? ".", "probe_out.jsonl");
            }
            catch (Exception e) { Mod.log.Error(e); }
        }

        protected override void OnUpdate()
        {
            if (finished || !GameManager.instance.gameMode.IsGame()) return;
            uint frame = sim.frameIndex;
            if (!started)
            {
                if (frame == 0 || GameManager.instance.isGameLoading) return;   // wait until the city is loaded
                started = true;
                startFrame = frame;
                var auto = World.GetExistingSystemManaged<AutoSaveSystem>();
                if (auto != null) auto.Enabled = false;   // never save during a probe run
                sim.selectedSpeed = F("speed", 3f);
                Write("{\"event\":\"start\",\"frame\":" + frame + ",\"speed\":" + F("speed", 3f).ToString(CultureInfo.InvariantCulture) + ",\"autoSaveDisabled\":" + (auto != null ? "true" : "false") + "}");
                lastSample = frame; lastScan = frame;
                Scan(); starts.Clear(); truckStarts = 0; allStarts = 0; scans = 0;
                if (cfg.TryGetValue("export", out var ex) && ex.Length > 0)
                {
                    try { Export(ex); Write("{\"event\":\"exported\",\"file\":\"" + Esc(ex) + "\"}"); }
                    catch (Exception e) { Mod.log.Error(e); Write("{\"event\":\"error\",\"message\":\"export: " + Esc(e.Message) + "\"}"); }
                    if (F("exportOnly", 0f) > 0) { finished = true; Write("{\"event\":\"done\"}"); if (F("quit", 1f) > 0) Application.Quit(); }
                }
                return;
            }
            var auto2 = World.GetExistingSystemManaged<AutoSaveSystem>();
            if (auto2 != null && auto2.Enabled) auto2.Enabled = false;
            if (sim.selectedSpeed != F("speed", 3f)) sim.selectedSpeed = F("speed", 3f);   // also unpauses
            if (frame - lastScan >= F("scanEveryMinutes", 2f) * FramesPerDay / 1440f) { lastScan = frame; try { Scan(); } catch (Exception e) { Mod.log.Error(e); } }
            float every = F("sampleEveryMinutes", 20f) * FramesPerDay / 1440f;
            if (frame - lastSample < every) return;
            lastSample = frame;
            float hours = (frame - startFrame) / FramesPerDay * 24f;
            try { Sample(frame, hours); } catch (Exception e) { Mod.log.Error(e); Write("{\"event\":\"error\",\"message\":\"" + Esc(e.Message) + "\"}"); }
            if (hours >= F("durationHours", 48f))
            {
                finished = true;
                Write("{\"event\":\"done\"}");
                if (F("quit", 1f) > 0) Application.Quit();
            }
        }

        // cars that are driving now but were not at the previous scan: trips started, by the driver's purpose
        void Scan()
        {
            scans++;
            var cur = new HashSet<Entity>();
            using (var ents = qPersonal.ToEntityArray(Allocator.Temp))
            using (var cars = qPersonal.ToComponentDataArray<PersonalCar>(Allocator.Temp))
                for (int i = 0; i < ents.Length; i++)
                {
                    cur.Add(ents[i]);
                    if (prevCars.Contains(ents[i])) continue;
                    var k = cars[i].m_Keeper;
                    string key = k != Entity.Null && EntityManager.Exists(k) && EntityManager.HasComponent<TravelPurpose>(k) ? EntityManager.GetComponentData<TravelPurpose>(k).m_Purpose.ToString() : "none";
                    starts[key] = starts.TryGetValue(key, out var n) ? n + 1 : 1;
                }
            prevCars = cur;
            var curT = new HashSet<Entity>();
            using (var ents = qDelivery.ToEntityArray(Allocator.Temp))
                for (int i = 0; i < ents.Length; i++) { curT.Add(ents[i]); if (!prevTrucks.Contains(ents[i])) truckStarts++; }
            prevTrucks = curT;
            var curA = new HashSet<Entity>();
            using (var ents = qMovingCars.ToEntityArray(Allocator.Temp))
                for (int i = 0; i < ents.Length; i++) { curA.Add(ents[i]); if (!prevAll.Contains(ents[i])) allStarts++; }
            prevAll = curA;
        }

        void Sample(uint frame, float hours)
        {
            var sb = new StringBuilder();
            sb.Append("{\"frame\":").Append(frame).Append(",\"hoursSinceStart\":").Append(hours.ToString("0.###", CultureInfo.InvariantCulture));
            sb.Append(",\"timeOfDay\":").Append(time.normalizedTime.ToString("0.####", CultureInfo.InvariantCulture));
            sb.Append(",\"realSpeed\":").Append(sim.smoothSpeed.ToString("0.##", CultureInfo.InvariantCulture));
            if (EntityManager.HasComponent<Population>(city.City))
                sb.Append(",\"population\":").Append(EntityManager.GetComponentData<Population>(city.City).m_Population);
            sb.Append(",\"households\":").Append(qHouseholds.CalculateEntityCount());
            sb.Append(",\"citizens\":").Append(qCitizens.CalculateEntityCount());
            sb.Append(",\"workers\":").Append(qWorkers.CalculateEntityCount());
            // jobs: all work providers; commercial = those selling services (ServiceAvailable)
            long jobs = 0, commercialJobs = 0;
            using (var ents = qCompanies.ToEntityArray(Allocator.Temp))
            using (var wps = qCompanies.ToComponentDataArray<WorkProvider>(Allocator.Temp))
                for (int i = 0; i < ents.Length; i++)
                {
                    jobs += wps[i].m_MaxWorkers;
                    if (EntityManager.HasComponent<ServiceAvailable>(ents[i])) commercialJobs += wps[i].m_MaxWorkers;
                }
            sb.Append(",\"jobs\":").Append(jobs).Append(",\"commercialJobs\":").Append(commercialJobs);
            sb.Append(",\"carsMoving\":").Append(qMovingCars.CalculateEntityCount());
            sb.Append(",\"personalCarsParked\":").Append(qParked.CalculateEntityCount());
            sb.Append(",\"deliveryTrucks\":").Append(qDelivery.CalculateEntityCount());
            foreach (var (name, q) in qTypes) sb.Append(",\"").Append(name).Append("\":").Append(q.CalculateEntityCount());
            // personal cars by the driver's purpose
            var byPurpose = new Dictionary<string, int>();
            using (var cars = qPersonal.ToComponentDataArray<PersonalCar>(Allocator.Temp))
                for (int i = 0; i < cars.Length; i++)
                {
                    var k = cars[i].m_Keeper;
                    string key = "none";
                    if (k != Entity.Null && EntityManager.Exists(k) && EntityManager.HasComponent<TravelPurpose>(k)) key = EntityManager.GetComponentData<TravelPurpose>(k).m_Purpose.ToString();
                    else if (k != Entity.Null) key = "noPurpose";
                    byPurpose[key] = byPurpose.TryGetValue(key, out var n) ? n + 1 : 1;
                }
            sb.Append(",\"personalCarsByPurpose\":{");
            bool first = true;
            foreach (var kv in byPurpose) { if (!first) sb.Append(','); first = false; sb.Append('"').Append(kv.Key).Append("\":").Append(kv.Value); }
            sb.Append('}');
            // citizens on the move (any mode) by purpose
            var trav = new Dictionary<string, int>();
            using (var tp = qTravellers.ToComponentDataArray<TravelPurpose>(Allocator.Temp))
                for (int i = 0; i < tp.Length; i++) { var key = tp[i].m_Purpose.ToString(); trav[key] = trav.TryGetValue(key, out var n) ? n + 1 : 1; }
            sb.Append(",\"travellersByPurpose\":{");
            first = true;
            foreach (var kv in trav) { if (!first) sb.Append(','); first = false; sb.Append('"').Append(kv.Key).Append("\":").Append(kv.Value); }
            sb.Append('}');
            sb.Append(",\"scans\":").Append(scans).Append(",\"carStartsAll\":").Append(allStarts).Append(",\"truckStarts\":").Append(truckStarts).Append(",\"personalStartsByPurpose\":{");
            first = true;
            foreach (var kv in starts) { if (!first) sb.Append(','); first = false; sb.Append('"').Append(kv.Key).Append("\":").Append(kv.Value); }
            sb.Append('}');
            starts.Clear(); truckStarts = 0; allStarts = 0; scans = 0;
            flow.RefreshCityTrafficAverages();
            sb.Append(",\"cityTrafficFlow\":").Append(flow.cityAverageTrafficFlow);
            sb.Append('}');
            Write(sb.ToString());
        }

        // the city as data for tools/sim: road edges (with the game's measured flow), nodes, buildings, outside connections
        void Export(string path)
        {
            var prefabs = World.GetOrCreateSystemManaged<PrefabSystem>();
            var ci = CultureInfo.InvariantCulture;
            string N(float v) => v.ToString("0.##", ci);
            var sb = new StringBuilder();
            sb.Append("{\"edges\":[");
            var qe = GetEntityQuery(new EntityQueryDesc { All = new[] { ComponentType.ReadOnly<Edge>(), ComponentType.ReadOnly<Curve>(), ComponentType.ReadOnly<Road>(), ComponentType.ReadOnly<PrefabRef>() },
                None = new[] { ComponentType.ReadOnly<Deleted>(), ComponentType.ReadOnly<Temp>() } });
            var nodes = new HashSet<Entity>();
            bool first = true;
            using (var ents = qe.ToEntityArray(Allocator.Temp))
                foreach (var e in ents)
                {
                    var ed = EntityManager.GetComponentData<Edge>(e); var cv = EntityManager.GetComponentData<Curve>(e); var rd = EntityManager.GetComponentData<Road>(e);
                    var pr = EntityManager.GetComponentData<PrefabRef>(e);
                    nodes.Add(ed.m_Start); nodes.Add(ed.m_End);
                    var fs = NetUtils.GetTrafficFlowSpeed(rd);
                    var vol = (rd.m_TrafficFlowDistance0 + rd.m_TrafficFlowDistance1) * 2.6666667f;
                    var b = cv.m_Bezier;
                    if (!first) sb.Append(','); first = false;
                    sb.Append("{\"id\":").Append(e.Index).Append(",\"a\":").Append(ed.m_Start.Index).Append(",\"b\":").Append(ed.m_End.Index)
                      .Append(",\"prefab\":\"").Append(Esc(prefabs.GetPrefabName(pr.m_Prefab))).Append("\",\"len\":").Append(N(cv.m_Length))
                      .Append(",\"owned\":").Append(EntityManager.HasComponent<Owner>(e) ? 1 : 0)
                      .Append(",\"curve\":[").Append(N(b.a.x)).Append(',').Append(N(b.a.z)).Append(',').Append(N(b.b.x)).Append(',').Append(N(b.b.z)).Append(',')
                      .Append(N(b.c.x)).Append(',').Append(N(b.c.z)).Append(',').Append(N(b.d.x)).Append(',').Append(N(b.d.z)).Append("],\"y\":").Append(N((b.a.y + b.d.y) / 2))
                      .Append(",\"flow\":[").Append(N(fs.x)).Append(',').Append(N(fs.y)).Append(',').Append(N(fs.z)).Append(',').Append(N(fs.w)).Append("],\"volume\":[")
                      .Append(N(vol.x)).Append(',').Append(N(vol.y)).Append(',').Append(N(vol.z)).Append(',').Append(N(vol.w)).Append("]}");
                }
            sb.Append("],\"nodes\":[");
            first = true;
            foreach (var n in nodes)
            {
                if (!EntityManager.HasComponent<Game.Net.Node>(n)) continue;
                var p = EntityManager.GetComponentData<Game.Net.Node>(n).m_Position;
                if (!first) sb.Append(','); first = false;
                sb.Append("{\"id\":").Append(n.Index).Append(",\"x\":").Append(N(p.x)).Append(",\"z\":").Append(N(p.z)).Append(",\"y\":").Append(N(p.y))
                  .Append(",\"outside\":").Append(EntityManager.HasComponent<Game.Objects.OutsideConnection>(n) ? 1 : 0).Append('}');
            }
            sb.Append("],\"buildings\":[");
            var qb = GetEntityQuery(new EntityQueryDesc { All = new[] { ComponentType.ReadOnly<Building>(), ComponentType.ReadOnly<PrefabRef>(), ComponentType.ReadOnly<Game.Objects.Transform>() },
                None = new[] { ComponentType.ReadOnly<Deleted>(), ComponentType.ReadOnly<Temp>() } });
            first = true;
            using (var ents = qb.ToEntityArray(Allocator.Temp))
                foreach (var e in ents)
                {
                    var bd = EntityManager.GetComponentData<Building>(e); var tr = EntityManager.GetComponentData<Game.Objects.Transform>(e);
                    int hh = 0, jobs = 0, cjobs = 0;
                    if (EntityManager.HasBuffer<Renter>(e))
                    {
                        var rs = EntityManager.GetBuffer<Renter>(e, true);
                        for (int i = 0; i < rs.Length; i++)
                        {
                            var r = rs[i].m_Renter;
                            if (EntityManager.HasComponent<Household>(r)) hh++;
                            if (EntityManager.HasComponent<WorkProvider>(r)) { var w = EntityManager.GetComponentData<WorkProvider>(r).m_MaxWorkers; jobs += w; if (EntityManager.HasComponent<ServiceAvailable>(r)) cjobs += w; }
                        }
                    }
                    if (EntityManager.HasComponent<WorkProvider>(e)) jobs += EntityManager.GetComponentData<WorkProvider>(e).m_MaxWorkers;
                    if (!first) sb.Append(','); first = false;
                    sb.Append("{\"id\":").Append(e.Index).Append(",\"prefab\":\"").Append(Esc(prefabs.GetPrefabName(EntityManager.GetComponentData<PrefabRef>(e).m_Prefab)))
                      .Append("\",\"x\":").Append(N(tr.m_Position.x)).Append(",\"z\":").Append(N(tr.m_Position.z))
                      .Append(",\"edge\":").Append(bd.m_RoadEdge == Entity.Null ? -1 : bd.m_RoadEdge.Index).Append(",\"t\":").Append(N(bd.m_CurvePosition))
                      .Append(",\"households\":").Append(hh).Append(",\"jobs\":").Append(jobs).Append(",\"commercialJobs\":").Append(cjobs)
                      .Append(",\"outside\":").Append(EntityManager.HasComponent<Game.Objects.OutsideConnection>(e) ? 1 : 0).Append('}');
                }
            sb.Append("]}");
            File.WriteAllText(path, sb.ToString());
        }

        static string Esc(string s) => (s ?? "").Replace("\\", "\\\\").Replace("\"", "'");

        void Write(string line)
        {
            try { File.AppendAllText(outPath, line + "\n"); } catch (Exception e) { Mod.log.Error(e); }
        }
    }
}
