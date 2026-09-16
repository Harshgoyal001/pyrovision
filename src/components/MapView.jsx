import React, { useState } from 'react';
import TacticalMap from './TacticalMap';
import GlobeView from './GlobeView';
import DossierPanel from './DossierPanel';
import { Globe, Map } from 'lucide-react';

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
  },
  toggleLayer = () => {},
}) {
  // 'map' = 2D Tactical Leaflet Map | 'globe' = 3D Google Earth-style Globe
  const [viewMode, setViewMode] = useState('map');
  const [cursorCoords, setCursorCoords] = useState(null);

  // Dynamic WGS-84 UTM Grid calculation
  const curLng = cursorCoords ? cursorCoords.lng : (selectedTarget ? Number(selectedTarget.longitude) : 82.0);
  const curLat = cursorCoords ? cursorCoords.lat : (selectedTarget ? Number(selectedTarget.latitude) : 20.5);
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
          <span className="text-slate-400">GRID: WGS-84 UTM-{utmZone}N</span>
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
              anomalies={anomalies}
              selectedTarget={selectedTarget}
              setSelectedTarget={setSelectedTarget}
              searchLocation={searchLocation}
              layers={layers}
              onMouseMove={setCursorCoords}
            />
          ) : (
            <GlobeView
              anomalies={anomalies}
              selectedTarget={selectedTarget}
              setSelectedTarget={setSelectedTarget}
              searchLocation={searchLocation}
              layers={layers}
              onMouseMove={setCursorCoords}
            />
          )}
        </div>
      </div>

      {/* Right side: Dossier Panel */}
      <DossierPanel
        anomalies={anomalies}
        selectedTarget={selectedTarget}
        setSelectedTarget={setSelectedTarget}
        stats={stats}
        layers={layers}
        toggleLayer={toggleLayer}
      />
    </div>
  );
}