import React from 'react';
import { RefreshCw, Filter, Download, Columns, Flame, MapPin } from 'lucide-react';

export default function StatisticsView({ anomalies = [], stats = {} }) {
  const getCategoryColor = (category) => {
    switch(category?.toUpperCase()) {
      case 'CRITICAL': return 'bg-red-500';
      case 'INDUSTRIAL': return 'bg-amber-500';
      case 'GAS FLARE': return 'bg-cyan-500';
      case 'AGRICULTURAL': return 'bg-green-500';
      default: return 'bg-slate-500';
    }
  };

  const getCategoryBadgeColor = (category) => {
    switch(category?.toUpperCase()) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'INDUSTRIAL': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'GAS FLARE': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50';
      case 'AGRICULTURAL': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const toDMS = (coord) => {
    const absolute = Math.abs(coord);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.floor((minutesNotTruncated - minutes) * 60);
    return `${degrees}°${minutes}'${seconds}"`;
  };

  const formatCoord = (lat, lon) => {
    const latDir = lat >= 0 ? "N" : "S";
    const lonDir = lon >= 0 ? "E" : "W";
    return `${toDMS(lat)}${latDir}, ${toDMS(lon)}${lonDir}`;
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 font-mono">
      {/* Header Section */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold text-white uppercase">STATISTICS & TACTICAL TELEMETRY ANALYTICS</h1>
          <span className="bg-green-500/20 text-green-400 text-[9px] px-2 py-0.5 rounded animate-pulse-glow uppercase">LIVE TELEMETRY STREAM</span>
        </div>
        <p className="text-[9px] text-slate-500 mt-1 uppercase">SYNCHRONIZED SATELLITE RADIATIVE INVENTORY • NATIONAL DEFENSE RECONNAISSANCE GRID UTM-44N</p>
        
        <div className="flex items-center gap-6 mt-2">
          <div className="text-[10px] uppercase">
            <span className="text-slate-400">CUMULATIVE DETECTIONS: </span>
            <span className="text-cyan-400 font-bold">{stats.total || 0}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase">
            <span className="text-slate-400">THREAT CONVEX: </span>
            <span className="bg-red-500/20 border border-red-500/50 text-red-400 px-2 py-0.5 rounded animate-blink-alert">DEFCON-2</span>
          </div>
          <button className="tactical-btn flex items-center gap-1 text-[10px] px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/40 rounded uppercase">
            <RefreshCw size={10} /> SYNC NOW
          </button>
        </div>
      </div>

      {/* 4 Gauge Cards Row */}
      <div className="grid grid-cols-4 gap-3">
        {/* Gauge 01 // THREAT INDEX */}
        <div className="bg-[#0F172A]/60 border border-slate-700/30 rounded p-3 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-2">
            <span className="text-[9px] text-slate-500 uppercase">GAUGE 01 //</span>
            <span className="bg-red-500/20 border border-red-500/50 text-red-400 px-2 py-0.5 rounded text-[9px] uppercase">DEFCON-2</span>
          </div>
          <div className="relative w-24 h-12 flex justify-center overflow-hidden">
            <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
              <path d="M 10 50 A 40 40 0 0 1 70 15" fill="none" stroke="#FF003C" strokeWidth="8" strokeLinecap="round" strokeDasharray="100" strokeDashoffset="0" className="animate-pulse-glow" />
            </svg>
            <div className="absolute bottom-0 text-xl font-bold text-white">2</div>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 uppercase">THREAT INDEX</div>
        </div>

        {/* Gauge 02 // RADIATIVE LOAD */}
        <div className="bg-[#0F172A]/60 border border-slate-700/30 rounded p-3 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-2">
            <span className="text-[9px] text-slate-500 uppercase">GAUGE 02 //</span>
            <div className="flex gap-1">
              <span className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 px-1 py-0.5 rounded text-[8px]">68%</span>
              <span className="bg-amber-500/20 border border-amber-500/50 text-amber-400 px-1 py-0.5 rounded text-[8px]">PEAK</span>
            </div>
          </div>
          <div className="relative w-24 h-12 flex justify-center overflow-hidden">
            <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
              <path d="M 10 50 A 40 40 0 0 1 65 15" fill="none" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round" />
            </svg>
            <div className="absolute bottom-0 text-xl font-bold text-white">68%</div>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 uppercase">RADIATIVE LOAD</div>
        </div>

        {/* FRP DISTRIBUTION HISTOGRAM */}
        <div className="bg-[#0F172A]/60 border border-slate-700/30 rounded p-3 flex flex-col">
          <div className="w-full flex justify-between items-center mb-2">
            <span className="text-[9px] text-slate-400 uppercase font-bold">FRP DISTRIBUTION HISTOGRAM</span>
            <span className="bg-slate-700/50 text-slate-300 px-1 py-0.5 rounded text-[8px] uppercase">5 BINS</span>
          </div>
          <div className="flex-1 flex items-end justify-between gap-1 mt-2 h-16 border-b border-slate-700">
            <div className="w-full flex flex-col items-center group">
              <span className="text-[8px] text-slate-500 opacity-0 group-hover:opacity-100 mb-1">342</span>
              <div className="w-full bg-cyan-400/60" style={{ height: '100%' }}></div>
              <span className="text-[7px] text-slate-500 mt-1 whitespace-nowrap overflow-hidden">0-500</span>
            </div>
            <div className="w-full flex flex-col items-center group">
              <span className="text-[8px] text-slate-500 opacity-0 group-hover:opacity-100 mb-1">284</span>
              <div className="w-full bg-cyan-400/60" style={{ height: '83%' }}></div>
              <span className="text-[7px] text-slate-500 mt-1 whitespace-nowrap overflow-hidden">500-1k</span>
            </div>
            <div className="w-full flex flex-col items-center group">
              <span className="text-[8px] text-slate-500 opacity-0 group-hover:opacity-100 mb-1">198</span>
              <div className="w-full bg-cyan-400/60" style={{ height: '57%' }}></div>
              <span className="text-[7px] text-slate-500 mt-1 whitespace-nowrap overflow-hidden">1k-2.5k</span>
            </div>
            <div className="w-full flex flex-col items-center group">
              <span className="text-[8px] text-slate-500 opacity-0 group-hover:opacity-100 mb-1">115</span>
              <div className="w-full bg-cyan-400/60" style={{ height: '33%' }}></div>
              <span className="text-[7px] text-slate-500 mt-1 whitespace-nowrap overflow-hidden">2.5k-5k</span>
            </div>
            <div className="w-full flex flex-col items-center group">
              <span className="text-[8px] text-slate-500 opacity-0 group-hover:opacity-100 mb-1">26</span>
              <div className="w-full bg-cyan-400/60" style={{ height: '7%' }}></div>
              <span className="text-[7px] text-slate-500 mt-1 whitespace-nowrap overflow-hidden">&gt;5k</span>
            </div>
          </div>
        </div>

        {/* 24-HR SATELLITE TREND */}
        <div className="bg-[#0F172A]/60 border border-slate-700/30 rounded p-3 flex flex-col">
          <div className="w-full flex justify-between items-center mb-2">
            <span className="text-[9px] text-slate-400 uppercase font-bold">24-HR SATELLITE TREND</span>
            <span className="bg-slate-700/50 text-slate-300 px-1 py-0.5 rounded text-[8px] uppercase">NOAA+S2</span>
          </div>
          <div className="flex-1 w-full relative mt-2">
            <svg viewBox="0 0 100 40" className="w-full h-full preserve-3d" preserveAspectRatio="none">
              <polygon points="0,40 0,30 20,25 40,35 60,15 80,20 100,5 100,40" fill="rgba(0,240,255,0.1)" />
              <polyline points="0,30 20,25 40,35 60,15 80,20 100,5" fill="none" stroke="#00F0FF" strokeWidth="1.5" />
              <circle cx="100" cy="5" r="2" fill="#FF003C" className="animate-pulse" />
            </svg>
          </div>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-slate-900/60 border border-red-500/30 rounded p-2 text-[10px] flex items-center justify-center text-center uppercase">
          <span className="text-red-400 font-bold">CURRENT SEV-2 ELEVATED <br/> ODISHA / CHHATTISGARH SECTOR</span>
        </div>
        <div className="bg-slate-900/60 border border-cyan-500/30 rounded p-2 text-[10px] flex items-center justify-center text-center uppercase">
          <span className="text-cyan-400 font-bold">ACTIVE: 14,332 LOAD: FRP MW <br/> NATIONAL 22,000 MW CEILING-ENVELOPE</span>
        </div>
        <div className="bg-slate-900/60 border border-amber-500/30 rounded p-2 text-[10px] flex items-center justify-center text-center uppercase">
          <span className="text-amber-400 font-bold">LOGARITHMIC SPREAD <br/> 26 CRITICAL RADIATORS</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-700/50 rounded p-2 text-[10px] flex items-center justify-center text-center uppercase">
          <span className="text-slate-400">T-ZERO: 12:00:00Z <br/> MODIFIED: {new Date().toISOString().substring(11, 19)}Z</span>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="mt-4 bg-[#0F172A]/80 border border-slate-700/50 rounded flex flex-col">
        <div className="p-3 border-b border-slate-700/50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-[11px] font-bold text-white uppercase">ACTIVE THERMAL ANOMALY TELEMETRY & TARGET DOSSIER TABLE</h2>
            <span className="bg-green-500/20 text-green-400 text-[9px] px-2 py-0.5 rounded border border-green-500/30 uppercase">{anomalies.length || 0} FILTERED TARGETS</span>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-2 top-1.5 text-cyan-500" size={12} />
              <input type="text" placeholder="FILTER TARGETS..." className="bg-[#070A0F] border border-cyan-500/30 rounded px-2 py-1 pl-6 text-[10px] text-cyan-100 focus:outline-none focus:border-cyan-500 uppercase" />
            </div>
            <button className="flex items-center gap-1 bg-[#070A0F] border border-slate-600 rounded px-2 py-1 text-[10px] text-slate-300 hover:text-white uppercase"><Download size={10} /> EXPORT CSV</button>
            <button className="flex items-center gap-1 bg-[#070A0F] border border-slate-600 rounded px-2 py-1 text-[10px] text-slate-300 hover:text-white uppercase"><Columns size={10} /> COLUMNS</button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[10px]">
            <thead className="bg-[#070A0F] border-b border-slate-700 text-slate-400">
              <tr>
                <th className="p-2 font-normal uppercase">TARGET ID</th>
                <th className="p-2 font-normal uppercase">FACILITY / ZONE</th>
                <th className="p-2 font-normal uppercase">COORDINATES (LAT/LON)</th>
                <th className="p-2 font-normal uppercase">CATEGORY</th>
              </tr>
            </thead>
            <tbody>
              {anomalies.length > 0 ? anomalies.map((anomaly, index) => (
                <tr key={anomaly.id || index} className={`border-b border-slate-800/50 hover:bg-slate-800/40 ${index % 2 !== 0 ? 'bg-slate-800/20' : ''}`}>
                  <td className="p-2 flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${getCategoryColor(anomaly.category)}`}></div>
                    <span className="font-bold text-cyan-400 uppercase">#{anomaly.id || `TGT-${900+index}`}</span>
                  </td>
                  <td className="p-2 text-slate-200 uppercase">{anomaly.name || 'UNKNOWN ZONE'}</td>
                  <td className="p-2 text-slate-400 font-mono">
                    {anomaly.lat && anomaly.lon ? formatCoord(anomaly.lat, anomaly.lon) : "21°46'30\"N, 85°08'12\"E"}
                  </td>
                  <td className="p-2">
                    <span className={`px-2 py-0.5 rounded border text-[8px] uppercase ${getCategoryBadgeColor(anomaly.category)}`}>
                      {anomaly.category || 'UNKNOWN'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr className="border-b border-slate-800/50 hover:bg-slate-800/40 bg-slate-800/20">
                  <td className="p-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    <span className="font-bold text-cyan-400 uppercase">#TH-2580</span>
                  </td>
                  <td className="p-2 text-slate-200 uppercase">NAGARNAR INTEGRATED STEEL COMPLEX</td>
                  <td className="p-2 text-slate-400 font-mono">19°05'24"N, 82°04'12"E</td>
                  <td className="p-2">
                    <span className="px-2 py-0.5 rounded border text-[8px] uppercase bg-red-500/20 text-red-400 border-red-500/50">CRITICAL</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
