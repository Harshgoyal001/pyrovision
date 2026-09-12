import React from 'react';
import { Shield, Radio, Lock, Wifi } from 'lucide-react';

export default function BottomBar({ stats }) {
  // Use fixed time or dynamically format current time. 
  // For static rendering, using the requested fixed format.
  const currentTime = new Date().toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' }) + ' IST';

  return (
    <div className="h-8 w-full bg-[#070A0F] border-t border-cyan-500/10 flex items-center justify-between px-4 text-[10px] tracking-wide shrink-0">
      
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-slate-400">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-glow shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          <span>WATCHDESK 04 // OP #NTRO-9182</span>
        </div>
        <div className="h-3 w-px bg-slate-700/50"></div>
        <div className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded flex items-center gap-1 border border-red-500/20">
          <Lock size={10} />
          <span>AES-256</span>
        </div>
        <span className="text-slate-500">SAT-AES256 ENCRYPTED // TELEMETRY LINK LOCKED</span>
      </div>

      {/* Center Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Wifi size={10} className="text-cyan-500" />
          <span className="text-slate-400">FIRMS STREAM:</span>
          <span className="text-green-400 font-bold">ONLINE</span>
        </div>
        <div className="h-3 w-px bg-slate-700/50"></div>
        <div className="flex items-center gap-1">
          <Radio size={10} className="text-slate-400" />
          <span className="text-slate-400">LATEST INGEST:</span>
          <span className="text-slate-300">{currentTime}</span>
          <span className="text-slate-500">(VIIRS NOAA-20)</span>
        </div>
        <div className="h-3 w-px bg-slate-700/50"></div>
        <div className="flex items-center gap-1">
          <span className="text-slate-400">ACTIVE PIXELS</span>
          <span className="text-slate-500">MONITORED:</span>
          <span className="text-cyan-400">{stats?.totalMonitored || '824,190'}</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">SCALE</span>
          <div className="w-16 h-1 bg-slate-800 rounded relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-1/3 bg-cyan-500/50"></div>
          </div>
          <span className="text-slate-400">25 KM</span>
        </div>
        <div className="h-3 w-px bg-slate-700/50"></div>
        <span className="text-slate-400">1:500,000</span>
        <div className="h-3 w-px bg-slate-700/50"></div>
        <div className="flex items-center gap-1">
          <Shield size={10} className="text-amber-400" />
          <span className="text-amber-400 font-bold">SECURITY LEVEL: SECRET // NOFORN</span>
        </div>
        <span className="text-slate-500">NTRO-SEC-SAT-08</span>
      </div>

    </div>
  );
}
