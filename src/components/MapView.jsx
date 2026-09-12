import React from 'react';
import TacticalMap from './TacticalMap';
import DossierPanel from './DossierPanel';

export default function MapView({ anomalies, selectedTarget, setSelectedTarget, stats, searchLocation, layers, toggleLayer }) {
  return (
    <div className="flex h-full w-full overflow-hidden bg-[#070A0F] font-mono">
      {/* Left side: Info bar + Map */}
      <div className="flex-1 flex flex-col relative h-full">
        {/* Info bar */}
        <div className="h-7 bg-[#0F172A]/80 border-b border-slate-700/30 flex items-center px-3 gap-6 text-[9px] z-10 w-full absolute top-0 left-0">
          <span className="text-slate-400">GRID: WGS-84 UTM-44N</span>
          <span className="text-slate-400">SENSOR: 375M VIIRS & 10M</span>
          {selectedTarget ? (
            <span className="text-cyan-400">
              LAT {selectedTarget.latitude}°N LON {selectedTarget.longitude}°E
            </span>
          ) : (
            <span className="text-cyan-400">LAT 19°05'12"N LON 82°01'44"E</span>
          )}
          <span className="text-slate-400">A2: 042 TRUE</span>
        </div>
        
        {/* Map Area */}
        <div className="flex-1 w-full h-full pt-7">
          <TacticalMap 
            anomalies={anomalies} 
            selectedTarget={selectedTarget} 
            setSelectedTarget={setSelectedTarget}
            searchLocation={searchLocation}
            layers={layers}
          />
        </div>
      </div>

      {/* Right side: Dossier */}
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