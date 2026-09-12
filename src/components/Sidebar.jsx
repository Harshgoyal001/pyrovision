import React, { useState, useEffect } from 'react';
import { 
  Map, 
  BarChart3, 
  Layers, 
  Crosshair, 
  GitBranch, 
  Shield 
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, stats, loading, error, lastFetchedAt, realtimeStatus, layers = {} }) => {
  // Ticking "time ago" clock so the last-updated label stays fresh without
  // needing a new fetch — re-renders every 5s.
  const [, forceTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => forceTick((n) => n + 1), 5000);
    return () => clearInterval(t);
  }, []);

  const timeAgo = (date) => {
    if (!date) return 'NEVER';
    const secs = Math.floor((Date.now() - date.getTime()) / 1000);
    if (secs < 5) return 'JUST NOW';
    if (secs < 60) return `${secs}S AGO`;
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}M AGO`;
    return `${Math.floor(mins / 60)}H AGO`;
  };

  // Real backend connection status — no more hardcoded "99.8% LIVE".
  const backendOk = !error && !loading;
  const backendLabel = error ? 'ERROR' : loading ? 'SYNCING...' : `${timeAgo(lastFetchedAt)}`;
  const backendDot = error ? 'bg-red-500' : loading ? 'bg-amber-400' : 'bg-green-500';
  const backendText = error ? 'text-red-400' : loading ? 'text-amber-400' : 'text-green-400';

  // Real WebSocket subscription state from Supabase realtime channel.
  const rtIsLive = realtimeStatus === 'SUBSCRIBED';
  const rtIsError = realtimeStatus === 'CHANNEL_ERROR' || realtimeStatus === 'TIMED_OUT' || realtimeStatus === 'CLOSED';
  const rtLabel = rtIsLive ? 'LIVE SYNC' : rtIsError ? 'DISCONNECTED' : 'CONNECTING...';
  const rtDot = rtIsLive ? 'bg-green-500' : rtIsError ? 'bg-red-500' : 'bg-amber-400';
  const rtText = rtIsLive ? 'text-green-400' : rtIsError ? 'text-red-400' : 'text-amber-400';

  // FIRMS-derived hotspot count — real, from stats.total.
  const firmsHasData = (stats?.total || 0) > 0;
  const firmsLabel = firmsHasData ? `${stats.total} DETECTED` : 'NO DATA';
  const firmsDot = firmsHasData ? 'bg-green-500' : 'bg-slate-500';
  const firmsText = firmsHasData ? 'text-green-400' : 'text-slate-500';

  // ESA WorldCover — tied to the real layer toggle in the map (see
  // DossierPanel's Layer Matrix Control / App.jsx layers state).
  const worldcoverOn = Boolean(layers.worldcover);
  const wcLabel = worldcoverOn ? 'ACTIVE' : 'OFF';
  const wcDot = worldcoverOn ? 'bg-green-500' : 'bg-slate-500';
  const wcText = worldcoverOn ? 'text-green-400' : 'text-slate-500';

  const allNominal = backendOk && rtIsLive && firmsHasData;

  const tabs = [
    { id: 'map', icon: Map, label: 'MAP VIEW', desc: 'LIVE CARTOGRAPHY & TARGETS', badge: 'ACTIVE', badgeColor: 'green' },
    { id: 'statistics', icon: BarChart3, label: 'STATISTICS', desc: 'DISTRIBUTION & SATELLITE KPIS', badge: '4 CHARTS', badgeColor: 'slate' },
    { id: 'layers', icon: Layers, label: 'LAYERS', desc: 'FIRMS, OSM & WORLDCOVER 10M', badge: '5/6 ACTIVE', badgeColor: 'cyan' },
    { id: 'thermal-hunt', icon: Crosshair, label: 'THERMAL HUNT', desc: 'GEO-TRANSFORMER MODEL', badge: 'AI/ML SEARCH', badgeColor: 'cyan' },
    { id: 'pipeline', icon: GitBranch, label: 'PIPELINE INFO', desc: 'INGEST DAEMONS & ETL QUEUES', badge: null },
  ];

  return (
    <div className="w-[260px] min-w-[260px] h-full bg-[#070A0F] border-r border-cyan-500/10 flex flex-col overflow-y-auto font-mono">
      {/* 1. Header Block */}
      <div className="p-3 border-b border-slate-700/30 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-700 border border-cyan-500/30 flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-cyan-400" />
        </div>
        <div className="flex flex-col">
          <div className="text-[11px] font-bold text-cyan-400">NTRO // GOI :: GEO-INT LABS</div>
          <div className="text-[9px] text-slate-400">TECH RES ORG :: DEFENSE GIS</div>
          <div className="flex items-center gap-1 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-glow" />
            <div className="text-[9px] text-green-400">GRID: WGS-84 UTM-44N SYNC</div>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="p-2 space-y-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          let badgeClass = "";
          if (tab.badgeColor === 'green') badgeClass = "bg-green-500/20 text-green-400 border border-green-500/30";
          else if (tab.badgeColor === 'cyan') badgeClass = "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30";
          else if (tab.badgeColor === 'slate') badgeClass = "bg-slate-700 text-slate-300 border border-slate-600";

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded text-left transition-colors ${
                isActive 
                  ? "bg-slate-800/80 border-l-2 border-cyan-400" 
                  : "hover:bg-slate-800/40 border-l-2 border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
              <div className="flex-1 min-w-0">
                <div className={`text-[11px] font-semibold truncate ${isActive ? "text-cyan-400" : "text-slate-300"}`}>
                  {tab.label}
                </div>
                <div className="text-[8px] text-slate-500 truncate">{tab.desc}</div>
              </div>
              {tab.badge && (
                <div className={`text-[8px] px-1.5 py-0.5 rounded whitespace-nowrap ${badgeClass}`}>
                  {tab.badge}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Tactical Threat Tiers */}
      <div className="p-3 border-t border-slate-700/30">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] text-slate-400">TACTICAL THREAT TIERS</div>
          <div className="bg-red-500/20 text-red-400 border border-red-500/30 text-[8px] px-1.5 py-0.5 rounded animate-pulse-glow">
            CRITICAL ENVELOPE
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-[#FF003C]" />
              <div className="text-[10px] text-slate-300">CRITICAL HOTSPOTS (&gt;2,000 MW)</div>
            </div>
            <div className="text-[10px] text-[#FF003C] font-bold font-mono">{stats?.criticalCount || 0}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-[#F59E0B]" />
              <div className="text-[10px] text-slate-300">INDUSTRIAL CLUSTERS</div>
            </div>
            <div className="text-[10px] text-amber-400 font-bold font-mono">{stats?.industrialCount || 0}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-[#22C55E]" />
              <div className="text-[10px] text-slate-300">SAL FOREST BUFFER BREACHES</div>
            </div>
            <div className="text-[10px] text-[#22C55E] font-bold font-mono">{stats?.forestBreachCount || 0} FLAGS</div>
          </div>
        </div>

      </div>

      {/* 4. Sensor Ingestion Matrix */}
      <div className="p-3 border-t border-slate-700/30">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] text-slate-400">SENSOR INGESTION MATRIX</div>
          <div className={`text-[8px] px-1.5 py-0.5 rounded border ${
            allNominal
              ? 'bg-green-500/20 text-green-400 border-green-500/30'
              : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
          }`}>
            {allNominal ? 'ALL NOMINAL' : 'CHECK STATUS'}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-800/40 border border-slate-700/30 rounded p-2">
            <div className="text-[9px] text-slate-300 mb-1">SUPABASE BACKEND</div>
            <div className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${backendDot}`} />
              <div className={`text-[9px] ${backendText}`}>{backendLabel}</div>
            </div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/30 rounded p-2">
            <div className="text-[9px] text-slate-300 mb-1">REALTIME WS SYNC</div>
            <div className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${rtDot}`} />
              <div className={`text-[9px] ${rtText}`}>{rtLabel}</div>
            </div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/30 rounded p-2">
            <div className="text-[9px] text-slate-300 mb-1">NASA FIRMS FEED</div>
            <div className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${firmsDot}`} />
              <div className={`text-[9px] ${firmsText}`}>{firmsLabel}</div>
            </div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/30 rounded p-2">
            <div className="text-[9px] text-slate-300 mb-1">ESA WORLDCOVER 10M</div>
            <div className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${wcDot}`} />
              <div className={`text-[9px] ${wcText}`}>{wcLabel}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Data Ingestion Stream */}
      <div className="mt-auto p-3 border-t border-slate-700/30 bg-slate-900/40">
        <div className="text-[9px] text-slate-500 mb-1">DATA INGESTION STREAM:</div>
        <div className="text-[9px] text-cyan-400 font-medium">
          SUPABASE + NASA FIRMS + ESA WORLDCOVER :: {rtIsLive ? 'LIVE' : rtLabel.toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;