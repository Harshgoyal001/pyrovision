import React, { useState } from 'react';
import { AlertTriangle, Download, Crosshair, CheckSquare, Square } from 'lucide-react';

export default function DossierPanel({ anomalies = [], selectedTarget, setSelectedTarget, stats = {}, layers = {}, toggleLayer = () => {} }) {
  const totalCount = stats.total || anomalies.length || 0;
  const categories = stats.categories || {};

  const unknownCount = categories['Unknown / Pending Sample'] || 0;
  const industrialCount = categories['Industrial Process'] || 0;
  const flareCount = categories['Gas Flare'] || 0;
  const wildfireCount = categories['Wildfire Front'] || 0;
  const cropCount = categories['Crop Residue Burning'] || 0;

  const unknownPct = totalCount ? ((unknownCount / totalCount) * 100).toFixed(1) : '0.0';
  const industrialPct = totalCount ? ((industrialCount / totalCount) * 100).toFixed(1) : '0.0';
  const flarePct = totalCount ? ((flareCount / totalCount) * 100).toFixed(1) : '0.0';
  const wildfirePct = totalCount ? ((wildfireCount / totalCount) * 100).toFixed(1) : '0.0';
  const cropPct = totalCount ? ((cropCount / totalCount) * 100).toFixed(1) : '0.0';

  const [taskingEngaged, setTaskingEngaged] = useState(false);

  const engagedCount = Object.values(layers).filter(Boolean).length;

  const handleExportCSV = () => {
    if (!selectedTarget) return;
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Name,Latitude,Longitude,Category,FRP_MW,Confidence,Severity,Region\n" +
      `${selectedTarget.id},"${selectedTarget.name}",${selectedTarget.latitude},${selectedTarget.longitude},"${selectedTarget.category}",${selectedTarget.frp_radiance},${selectedTarget.confidence},"${selectedTarget.severity_status}","${selectedTarget.region || ''}"`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DOSSIER_${selectedTarget.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-[320px] min-w-[320px] max-w-[320px] h-full bg-[#070A0F] border-l border-cyan-500/20 overflow-y-auto flex flex-col font-mono select-none text-slate-200">
      
      {/* 1. LAYER MATRIX CONTROL */}
      <div className="p-3 border-b border-cyan-500/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-cyan-400 text-xs">◆</span>
            <h3 className="text-[10px] font-bold text-slate-200 uppercase tracking-wider">LAYER MATRIX CONTROL</h3>
          </div>
          <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[8px] px-1.5 py-0.5 rounded font-mono font-bold">
            {engagedCount}/6 ENGAGED
          </span>
        </div>
        
        <div className="space-y-1 mt-2.5">
          {/* FIRMS */}
          <div 
            onClick={() => toggleLayer('firms')}
            className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-slate-900/60 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={layers.firms} 
                onChange={() => {}} 
                className="cursor-pointer"
              />
              <span className="text-[10px] text-slate-300">FIRMS Thermal Hotspots</span>
            </div>
            <span className="text-cyan-400 text-[10px] font-bold font-mono">{totalCount}</span>
          </div>

          {/* Industrial Facilities */}
          <div 
            onClick={() => toggleLayer('industrial')}
            className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-slate-900/60 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={layers.industrial} 
                onChange={() => {}} 
                className="cursor-pointer"
              />
              <span className="text-[10px] text-slate-300">Industrial Facilities</span>
            </div>
            <span className="text-slate-400 text-[10px] font-mono">{industrialCount}</span>
          </div>

          {/* Priority Risk Shading */}
          <div 
            onClick={() => toggleLayer('risk')}
            className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-slate-900/60 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={layers.risk} 
                onChange={() => {}} 
                className="cursor-pointer"
              />
              <span className="text-[10px] text-slate-300">Priority Risk Shading</span>
            </div>
            <span className="bg-red-500/20 text-[#FF003C] border border-red-500/40 px-1 py-0.2 text-[8px] font-bold rounded">
              {stats.criticalCount || 0} CRITICAL
            </span>
          </div>

          {/* ESA WorldCover 10m */}
          <div 
            onClick={() => toggleLayer('worldcover')}
            className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-slate-900/60 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={layers.worldcover} 
                onChange={() => {}} 
                className="cursor-pointer"
              />
              <span className="text-[10px] text-slate-300">ESA WorldCover 10m</span>
            </div>
            <span className="bg-green-500/20 text-[#22C55E] border border-green-500/40 px-1 py-0.2 text-[8px] font-bold rounded">
              ACTIVE
            </span>
          </div>

          {/* Population Density Buffer */}
          <div 
            onClick={() => toggleLayer('buffer')}
            className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-slate-900/60 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={layers.buffer} 
                onChange={() => {}} 
                className="cursor-pointer"
              />
              <span className="text-[10px] text-slate-300">Population Density Buffer</span>
            </div>
            <span className="text-slate-400 text-[10px] font-mono">5 KM</span>
          </div>

          {/* Cloud Mask Filter */}
          <div 
            onClick={() => toggleLayer('cloudmask')}
            className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-slate-900/60 cursor-pointer transition-colors opacity-60"
          >
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={layers.cloudmask} 
                onChange={() => {}} 
                className="cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Cloud Mask Filter (S2 L2A)</span>
            </div>
            <span className="text-slate-500 text-[10px] font-mono">OFF</span>
          </div>
        </div>
      </div>

      {/* 2. CLASSIFICATION MIX (100% Dynamic from real backend) */}
      <div className="p-3 border-b border-cyan-500/10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CLASSIFICATION MIX</h3>
          <span className="text-cyan-400 text-[10px] font-bold font-mono">{totalCount} DETECTIONS</span>
        </div>

        {/* Dynamic multi-color horizontal stacked progress bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-sm overflow-hidden flex my-2 border border-slate-700/50">
          <div style={{ width: `${unknownPct}%` }} className="bg-[#64748B] h-full transition-all" title={`Unknown (${unknownPct}%)`} />
          <div style={{ width: `${industrialPct}%` }} className="bg-[#F59E0B] h-full transition-all" title={`Industrial (${industrialPct}%)`} />
          <div style={{ width: `${flarePct}%` }} className="bg-[#00F0FF] h-full transition-all" title={`Gas Flare (${flarePct}%)`} />
          <div style={{ width: `${wildfirePct}%` }} className="bg-[#FF003C] h-full transition-all" title={`Wildfire (${wildfirePct}%)`} />
          <div style={{ width: `${cropPct}%` }} className="bg-[#22C55E] h-full transition-all" title={`Crop Residue (${cropPct}%)`} />
        </div>
        
        <div className="space-y-1.5 mt-2.5">
          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#64748B] shrink-0" />
              <span className="text-slate-400">Unknown / Pending Sample</span>
            </div>
            <span className="text-slate-300 font-mono">{unknownCount} ({unknownPct}%)</span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#F59E0B] shrink-0" />
              <span className="text-slate-300">Industrial Process</span>
            </div>
            <span className="text-slate-300 font-mono">{industrialCount} ({industrialPct}%)</span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00F0FF] shrink-0" />
              <span className="text-slate-300">Gas Flare</span>
            </div>
            <span className="text-slate-300 font-mono">{flareCount} ({flarePct}%)</span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FF003C] shrink-0" />
              <span className="text-slate-300">Wildfire Front</span>
            </div>
            <span className="text-slate-300 font-mono">{wildfireCount} ({wildfirePct}%)</span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#22C55E] shrink-0" />
              <span className="text-slate-300">Crop Residue Burning</span>
            </div>
            <span className="text-slate-300 font-mono">{cropCount} ({cropPct}%)</span>
          </div>
        </div>
      </div>

      {/* 3. ACTIVE TARGET DOSSIER (100% Dynamic from selectedTarget) */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Dossier Header */}
          <div className="flex items-center justify-between pb-2 border-b border-cyan-500/10">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#00F0FF] inline-block" />
              <h3 className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">ACTIVE TARGET DOSSIER</h3>
            </div>
            <span className={`text-white text-[9px] px-2 py-0.5 font-bold uppercase tracking-wider ${
              selectedTarget?.severity_status?.includes('CRITICAL') ? 'bg-[#FF003C]' : 'bg-amber-600'
            }`}>
              {selectedTarget?.severity_status || 'STANDBY'}
            </span>
          </div>
          
          {selectedTarget ? (
            <div className="mt-3 space-y-3">
              {/* Target Name & Coords */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-white tracking-wide">{selectedTarget.name}</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">
                    LAT {selectedTarget.latitude?.toFixed(4)}°N, LON {selectedTarget.longitude?.toFixed(4)}°E | {selectedTarget.region}
                  </div>
                </div>
                <div className="text-amber-400 text-[10px] font-bold font-mono">#{selectedTarget.id}</div>
              </div>

              {/* FRP & SWIR B12 Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#0F172A]/70 border border-slate-700/40 p-2 rounded">
                  <div className="text-[8px] text-slate-400 uppercase tracking-wider">FRP RADIATIVE:</div>
                  <div className="text-xs text-cyan-400 font-bold mt-0.5 font-mono">
                    {selectedTarget.frp_radiance?.toLocaleString()} MW
                  </div>
                </div>
                <div className="bg-[#0F172A]/70 border border-slate-700/40 p-2 rounded">
                  <div className="text-[8px] text-slate-400 uppercase tracking-wider">SWIR B12 CONF:</div>
                  <div className="text-xs text-[#22C55E] font-bold mt-0.5 font-mono">
                    {selectedTarget.confidence}% L2A
                  </div>
                </div>
              </div>

              {/* Persistence History */}
              <div className="bg-[#0F172A]/40 border border-slate-800 p-2 rounded">
                <div className="text-[8px] text-slate-400 uppercase tracking-wider mb-1">PERSISTENCE HISTORY:</div>
                <div className="text-[9px] text-slate-300 leading-tight">
                  {selectedTarget.threat_summary}
                </div>
              </div>

              {/* Proximity Threat Buffer Alert */}
              <div className="bg-red-950/20 border border-[#FF003C]/40 p-2.5 rounded">
                <div className="flex items-center gap-1.5 mb-1 text-[#FF003C]">
                  <AlertTriangle size={12} className="animate-pulse" />
                  <span className="text-[9px] font-bold tracking-wider uppercase">PROXIMITY THREAT BUFFER:</span>
                </div>
                <p className="text-[8.5px] text-slate-300 leading-relaxed">
                  Perimeter thermal envelope of #{selectedTarget.id} is actively monitored. Early warning mitigation flag active.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-[10px]">
              CLICK A HOTSPOT ON THE MAP CANVAS TO LOAD TARGET DOSSIER
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-cyan-500/10 flex gap-2">
          <button 
            onClick={() => setTaskingEngaged(!taskingEngaged)}
            className={`flex-1 py-1.5 px-2 text-[10px] font-bold uppercase transition-all border flex items-center justify-center gap-1.5 ${
              taskingEngaged
                ? 'bg-green-500/20 border-green-500 text-green-400'
                : 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20'
            }`}
          >
            <Crosshair size={12} />
            {taskingEngaged ? 'TASKED // SYNC' : 'ENGAGE TASKING'}
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex-1 py-1.5 px-2 text-[10px] font-bold uppercase border border-slate-700 hover:border-slate-500 bg-[#0F172A] text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5"
          >
            <Download size={12} />
            EXPORT RAW CSV
          </button>
        </div>

      </div>

    </div>
  );
}
