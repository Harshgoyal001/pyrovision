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

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#070A0F] font-mono">
      {/* Left side: Info bar + Map / Globe */}
      <div className="flex-1 flex flex-col relative h-full">
        {/* Info bar */}
        <div className="h-7 bg-[#0F172A]/80 border-b border-slate-700/30 flex items-center px-3 gap-4 text-[9px] z-10 w-full absolute top-0 left-0">
          <span className="text-slate-400">GRID: WGS-84 UTM-44N</span>
          <span className="text-slate-400">SENSOR: 375M VIIRS & 10M</span>
          {selectedTarget ? (
            <span className="text-cyan-400">
              LAT {Number(selectedTarget.latitude).toFixed(4)}°N LON {Number(selectedTarget.longitude).toFixed(4)}°E
            </span>
          ) : (
            <span className="text-cyan-400">LAT 19°05'12"N LON 82°01'44"E</span>
          )}
          <span className="text-slate-400 hidden sm:inline">A2: 042 TRUE</span>

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
            />
          ) : (
            <GlobeView
              anomalies={anomalies}
              selectedTarget={selectedTarget}
              setSelectedTarget={setSelectedTarget}
              searchLocation={searchLocation}
              layers={layers}
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