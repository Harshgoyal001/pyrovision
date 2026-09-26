import React, { useState, useCallback, useMemo, useEffect } from 'react';
import TacticalMap from './TacticalMap';
import GlobeView from './GlobeView';
import DossierPanel from './DossierPanel';
import { Globe, Map, Clock } from 'lucide-react';

export default function MapView({
  anomalies = [],
  selectedTarget,
  setSelectedTarget,
  stats = {},
  searchLocation,
  layers = {
    firms: true,
    industrial: true,
    risk: true,
    worldcover: true,
    buffer: true,
    cloudmask: false,
    wriPlants: true,
  },
  toggleLayer = () => {},
}) {
  // 'map' = 2D Tactical Leaflet Map | 'globe' = 3D Google Earth-style Globe
  const [viewMode, setViewMode] = useState('map');
  const [cursorCoords, setCursorCoords] = useState(null);
  const [dayFilter, setDayFilter] = useState(24); // default 24 hours

  // Filter anomalies based on selected time window (24h, 3 days, 5 days, 7 days, All)
  const filteredAnomalies = useMemo(() => {
    if (!anomalies?.length) return [];
    if (dayFilter === 'ALL') return anomalies;

    const validTimes = anomalies
      .map((a) => {
        const raw = a.timestamp || a.acq_date || a.last_detected || a.created_at || a.date;
        if (!raw) return null;
        const t = new Date(raw).getTime();
        return isNaN(t) ? null : t;
      })
      .filter((t) => t !== null);

    if (validTimes.length === 0) return anomalies;

    const maxTime = Math.max(...validTimes);
    const now = Date.now();
    // Anchor to current time if anomalies are within the last 30 days, else anchor to latest anomaly
    const referenceTime = now - maxTime < 30 * 24 * 60 * 60 * 1000 && now >= maxTime ? now : maxTime;

    const cutoff = referenceTime - dayFilter * 60 * 60 * 1000;
    const result = anomalies.filter((a) => {
      const raw = a.timestamp || a.acq_date || a.last_detected || a.created_at || a.date;
      if (!raw) return true;
      const t = new Date(raw).getTime();
      return isNaN(t) ? true : t >= cutoff;
    });

    // Fail-safe to avoid 0 hotspots if there is an extreme clock skew
    return result.length > 0 ? result : anomalies;
  }, [anomalies, dayFilter]);

  // Synchronize selected target with currently filtered anomalies
  useEffect(() => {
    if (filteredAnomalies.length > 0) {
      if (!selectedTarget || !filteredAnomalies.some((a) => a.id === selectedTarget.id)) {
        setSelectedTarget(filteredAnomalies[0]);
      }
    }
  }, [filteredAnomalies, selectedTarget, setSelectedTarget]);

  const handleMouseMove = useCallback((coords) => {
    setCursorCoords(coords);
  }, []);

  // Dynamic WGS-84 UTM Grid calculation
  const curLng = cursorCoords ? cursorCoords.lng : selectedTarget ? Number(selectedTarget.longitude) : 82.0;
  const curLat = cursorCoords ? cursorCoords.lat : selectedTarget ? Number(selectedTarget.latitude) : 20.5;
  const utmZone = Math.min(60, Math.max(1, Math.floor((curLng + 180) / 6) + 1));

  // Dynamic Azimuth / Bearing from map origin
  const dLng = curLng - 82.0;
  const dLat = curLat - 20.5;
  const rawBearing = ((Math.atan2(dLng, dLat) * 180) / Math.PI + 360) % 360;
  const azStr = Math.round(rawBearing).toString().padStart(3, '0');

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#070A0F] font-mono">
      {/* Left side: Info bar + Map / Globe */}
      <div className="flex-1 flex flex-col relative h-full">
        {/* Info bar */}
        <div className="h-7 bg-[#0F172A]/90 border-b border-slate-700/30 flex items-center px-3 gap-3 text-[9px] z-10 w-full absolute top-0 left-0 backdrop-blur-sm select-none">
          {/* Day / Time Window Filter in the Left Corner */}
          <div className="flex items-center gap-1.5 bg-[#080d1a] border border-cyan-500/40 rounded px-2 py-0.5 shadow-sm">
            <Clock size={11} className="text-cyan-400" />
            <span className="text-cyan-400 font-bold tracking-wider text-[9px]">TIME:</span>
            <select
              value={dayFilter}
              onChange={(e) => setDayFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              className="bg-transparent text-slate-200 text-[10px] font-mono font-semibold focus:outline-none cursor-pointer"
            >
              <option value={24} className="bg-[#0F172A] text-slate-200">24h</option>
              <option value={72} className="bg-[#0F172A] text-slate-200">3 Days</option>
              <option value={120} className="bg-[#0F172A] text-slate-200">5 Days</option>
              <option value={168} className="bg-[#0F172A] text-slate-200">7 Days</option>
              <option value="ALL" className="bg-[#0F172A] text-slate-200">All</option>
            </select>
            <span className="text-cyan-400/80 font-mono text-[9px] border-l border-slate-700 pl-1.5 ml-0.5">
              {filteredAnomalies.length}
            </span>
          </div>

          <span className="text-slate-400 hidden sm:inline">GRID: WGS-84 UTM-{utmZone}N</span>
          <span className="text-slate-400 hidden md:inline">SENSOR: 375M VIIRS & 10M</span>

          {/* Real-time live coordinates tracking with high 5-decimal precision */}
          {cursorCoords ? (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-normal">REAL LAT/LON:</span>
              <span className="text-[#00F0FF] font-mono tracking-wider font-bold">
                LAT {cursorCoords.lat.toFixed(5)}°N LON {cursorCoords.lng.toFixed(5)}°E
              </span>
            </div>
          ) : selectedTarget ? (
            <div className="flex items-center gap-1.5 font-bold">
              <span className="text-slate-400 font-normal">TARGET:</span>
              <span className="text-cyan-400 font-mono tracking-wider">
                LAT {Number(selectedTarget.latitude).toFixed(4)}°N LON {Number(selectedTarget.longitude).toFixed(4)}°E
              </span>
            </div>
          ) : (
            <span className="text-slate-500 font-mono">HOVER MAP FOR REAL LAT/LON</span>
          )}

          <span className="text-slate-400 hidden sm:inline font-mono">AZ: {azStr} TRUE</span>

          {/* Mode Switcher: FLAT 2D vs 3D GLOBE */}
          <div className="ml-auto flex items-center border border-slate-700 rounded overflow-hidden">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1 px-2.5 py-0.5 text-[9px] uppercase font-bold transition-colors ${
                viewMode === 'map'
                  ? 'bg-cyan-500/20 text-cyan-400 border-r border-slate-700'
                  : 'text-slate-500 hover:text-slate-300 border-r border-slate-700'
              }`}
              title="Standard 2D Tactical Map"
            >
              <Map size={10} />
              FLAT
            </button>
            <button
              onClick={() => setViewMode('globe')}
              className={`flex items-center gap-1 px-2.5 py-0.5 text-[9px] uppercase font-bold transition-colors ${
                viewMode === 'globe'
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="3D Google Earth Satellite Globe"
            >
              <Globe size={10} />
              3D GLOBE
            </button>
          </div>
        </div>

        {/* Viewport: Flat TacticalMap or 3D Globe */}
        <div className="flex-1 w-full h-full pt-7">
          {viewMode === 'map' ? (
            <TacticalMap
              anomalies={filteredAnomalies}
              selectedTarget={selectedTarget}
              setSelectedTarget={setSelectedTarget}
              searchLocation={searchLocation}
              layers={layers}
              onMouseMove={handleMouseMove}
              showPowerPlants={layers.wriPlants}
            />
          ) : (
            <GlobeView
              anomalies={filteredAnomalies}
              selectedTarget={selectedTarget}
              setSelectedTarget={setSelectedTarget}
              searchLocation={searchLocation}
              layers={layers}
              onMouseMove={handleMouseMove}
            />
          )}
        </div>
      </div>

      {/* Right side: Dossier Panel */}
      <DossierPanel
        anomalies={filteredAnomalies}
        selectedTarget={selectedTarget}
        setSelectedTarget={setSelectedTarget}
        stats={stats}
        layers={layers}
        toggleLayer={toggleLayer}
      />
    </div>
  );
}