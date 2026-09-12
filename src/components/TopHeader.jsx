import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, FileDown, Shield, Clock } from 'lucide-react';

const TopHeader = ({ anomalies, stats }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-GB', { hour12: false });
  };

  const formatZulu = (date) => {
    return date.toISOString().substring(11, 19);
  };

  return (
    <header className="w-full h-[52px] bg-[#070A0F] border-b border-cyan-500/10 flex items-center px-3 gap-3 text-[10px] tracking-wide font-mono shrink-0 select-none">
      {/* 1. PYROVISION Logo block */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span className="text-[16px] font-bold text-white tracking-widest leading-none">PYROVISION</span>
          <span className="bg-red-600 text-white text-[9px] px-2 py-0.5 rounded-sm font-semibold leading-none">SEC-OPS // INDIA</span>
        </div>
        <div className="flex flex-col leading-[1]">
          <span className="text-[8px] text-slate-500 uppercase mt-1">NATIONAL THERMAL ANOMALY & EARLY</span>
          <span className="text-[8px] text-slate-500 uppercase">DISASTER WARNING SYSTEM</span>
        </div>
      </div>

      {/* 2. Active Hotspots counter */}
      <div className="border border-cyan-500/30 rounded px-3 py-1.5 flex items-center gap-2 h-8">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
        <div className="flex flex-col leading-[1.1]">
          <span className="text-cyan-400 font-bold text-[11px] uppercase">{stats?.total || 0} ACTIVE</span>
          <span className="text-[9px] text-slate-400 uppercase">HOTSPOTS</span>
        </div>
      </div>

      {/* 3. Search bar */}
      <div className="flex items-center gap-1 border border-slate-700 rounded px-2 py-1 h-8 bg-slate-900/40">
        <Search size={12} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="Se" 
          className="bg-transparent border-none outline-none text-slate-300 w-12 text-[10px] placeholder:text-slate-600"
        />
        <span className="text-[8px] text-slate-500 bg-slate-800 px-1 rounded ml-1">[CTRL+K]</span>
      </div>

      {/* 4. Security Banner */}
      <div className="flex-1 border border-amber-500/40 rounded px-4 py-1.5 flex items-center justify-center h-8 bg-amber-500/5">
        <span className="text-amber-400 font-semibold text-[10px] tracking-wider uppercase">
          TOP SECRET // RESTRICTED - FOR INDIAN EYES ONLY // GOI-INTERNAL
        </span>
      </div>

      {/* 5. Early Warning Button */}
      <div className="border border-red-500/50 rounded px-3 py-1.5 cursor-pointer animate-blink-alert flex items-center gap-1.5 h-8 bg-red-950/20 hover:bg-red-900/40 transition-colors">
        <AlertTriangle size={14} className="text-red-400" />
        <span className="text-red-400 font-semibold uppercase">EARLY WARNING REPORT</span>
        <span className="text-red-300 ml-1 font-semibold uppercase">(1 ALERT)</span>
      </div>

      {/* 6. Export Button */}
      <button className="tactical-btn flex items-center justify-center gap-1.5 h-8 px-3">
        <FileDown size={14} />
        <span className="uppercase">EXPORT INTEL PDF</span>
      </button>

      {/* 7. Clock section */}
      <div className="text-right border-l border-slate-700/50 pl-3 flex flex-col justify-center min-w-[140px]">
        <div className="flex items-center justify-end gap-2 mb-0.5">
          <span className="text-cyan-400 text-[10px] whitespace-nowrap uppercase">UTC+5:30 IST /</span>
          <span className="bg-red-600/30 border border-red-500/50 text-red-400 px-1.5 rounded text-[9px] font-bold uppercase">DEFCON-2</span>
        </div>
        <div className="flex items-center justify-end">
          <span className="text-cyan-100 text-sm font-bold leading-none tracking-widest">{formatTime(time)}</span>
        </div>
        <div className="text-[8px] text-slate-500 uppercase mt-0.5 leading-none">
          {formatZulu(time)} ZULU
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
