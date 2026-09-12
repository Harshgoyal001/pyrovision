import React from 'react';
import { Play, Download, Lock, Crosshair, AlertOctagon } from 'lucide-react';

export default function ThermalHuntView({ anomalies = [] }) {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 font-mono bg-[#070A0F]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold text-white uppercase">GEO-TRANSFORMER THERMAL HUNT // NEURAL SEMANTIC & MULTI-SPECTRAL VECTOR TARGETING</h1>
          <span className="bg-green-500/20 text-green-400 text-[9px] px-2 py-0.5 rounded border border-green-500/30 uppercase animate-pulse-glow">AI READY</span>
        </div>
        <p className="text-[9px] text-slate-500 mt-1 uppercase">MULTIMODAL EMBEDDING QUERY ENGINE • PYTORCH / TENSOR-RT FP16A ACCELERATED</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button className="tactical-btn flex items-center gap-1 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 px-3 py-1.5 rounded text-[10px] hover:bg-cyan-500/40 uppercase font-bold">
          <Play size={10} /> EXECUTE AI SWEEP
        </button>
        <button className="tactical-btn flex items-center gap-1 bg-[#0F172A] border border-cyan-500/50 text-cyan-400 px-3 py-1.5 rounded text-[10px] hover:bg-cyan-500/20 uppercase font-bold">
          <Download size={10} /> EXPORT PREDICTIVE INTEL
        </button>
      </div>

      {/* Model Info Cards */}
      <div className="grid grid-cols-5 gap-2">
        <div className="bg-[#0F172A]/60 border border-slate-700/30 rounded p-2 text-center flex flex-col justify-center">
          <span className="text-[8px] text-slate-500 uppercase">MODEL ARCHITECTURE</span>
          <span className="text-[10px] text-cyan-400 font-bold uppercase mt-1">GEO-TRANSFORMER v4.2-DEFENSE</span>
        </div>
        <div className="bg-[#0F172A]/60 border border-slate-700/30 rounded p-2 text-center flex flex-col justify-center">
          <span className="text-[8px] text-slate-500 uppercase">EXECUTION RUNTIME</span>
          <span className="text-[10px] text-slate-300 font-bold uppercase mt-1">WEIGHTS: FP16 TENSOR-RT</span>
        </div>
        <div className="bg-[#0F172A]/60 border border-slate-700/30 rounded p-2 text-center flex flex-col justify-center">
          <span className="text-[8px] text-slate-500 uppercase">INFERENCE LATENCY</span>
          <span className="text-[10px] text-slate-300 font-bold uppercase mt-1">18ms INFERENCE (GPU-0)</span>
        </div>
        <div className="bg-[#0F172A]/60 border border-slate-700/30 rounded p-2 text-center flex flex-col justify-center col-span-2">
          <span className="text-[8px] text-slate-500 uppercase">CONFIDENCE THRESHOLD</span>
          <span className="text-[10px] text-slate-300 font-bold uppercase mt-1">&gt; 88% COSINE SIM</span>
        </div>
      </div>

      {/* Natural Language Query */}
      <div className="bg-[#0F172A]/40 border border-cyan-500/20 rounded-lg p-4 mt-4 relative">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] text-slate-400 uppercase font-bold">NATURAL LANGUAGE & MULTI-SPECTRAL VECTOR QUERY PROMPT</span>
          <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded text-[8px] uppercase">VECTOR INDEX: 142,000 EMBEDDINGS</span>
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="FIND ALL STEEL OR METALLURGICAL PLANTS WITHIN 3KM..." 
            className="flex-1 h-10 bg-[#070A0F] border border-cyan-500/30 rounded px-3 text-[11px] text-white focus:outline-none focus:border-cyan-500 font-mono"
            defaultValue="Find all steel or metallurgical plants within 3km..."
          />
          <button className="flex items-center gap-1 bg-green-500/20 border border-green-500/50 text-green-400 px-4 rounded hover:bg-green-500/40 uppercase font-bold text-[10px]">
            <Play size={12} /> PARSE & INFER
          </button>
        </div>
        
        {/* Preset Query Chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="px-3 py-1 rounded-full text-[9px] border border-green-500/30 bg-green-500/10 text-green-400 cursor-pointer hover:bg-green-500/20 uppercase">CANOPY ENCROACHMENT RISK</span>
          <span className="px-3 py-1 rounded-full text-[9px] border border-green-500/30 bg-green-500/10 text-green-400 cursor-pointer hover:bg-green-500/20 uppercase">UNREGISTERED SMELTERS</span>
          <span className="px-3 py-1 rounded-full text-[9px] border border-green-500/30 bg-green-500/10 text-green-400 cursor-pointer hover:bg-green-500/20 uppercase">CROP RESIDUE VS FOREST BOUNDARY</span>
          <span className="px-3 py-1 rounded-full text-[9px] border border-red-500/50 bg-red-500/20 text-red-400 cursor-pointer uppercase font-bold">OFFSHORE GAS FLARE FLUCTUATION</span>
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div>
          <div className="flex justify-between text-[9px] text-slate-400 mb-1 uppercase">
            <span>MIN RADIATIVE POWER (FRP)</span>
            <span className="text-red-400 font-bold">1,000 MW</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-red-500 h-full w-[40%]"></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-[9px] text-slate-400 mb-1 uppercase">
            <span>SPECTRAL MATCH COSINE SIM</span>
            <span className="text-cyan-400">0.85</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-400 h-full w-[85%]"></div>
          </div>
        </div>
        <div>
          <div className="text-[9px] text-slate-400 mb-1 uppercase">TEMPORAL DELTA WINDOW</div>
          <div className="flex gap-1 h-5">
            <button className="flex-1 bg-slate-800 text-slate-400 border border-slate-700 rounded text-[9px] uppercase"> -3H </button>
            <button className="flex-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded text-[9px] uppercase font-bold"> -12H </button>
            <button className="flex-1 bg-slate-800 text-slate-400 border border-slate-700 rounded text-[9px] uppercase"> -24H </button>
          </div>
        </div>
        <div>
          <div className="text-[9px] text-slate-400 mb-1 uppercase">GEO-FENCE BOUNDARY</div>
          <div className="flex gap-1 h-5">
            <button className="flex-1 bg-green-500/20 text-green-400 border border-green-500/50 rounded text-[8px] uppercase font-bold"> BASTAR </button>
            <button className="flex-1 bg-slate-800 text-slate-400 border border-slate-700 rounded text-[8px] uppercase"> CHOTA NAGPUR </button>
            <button className="flex-1 bg-slate-800 text-slate-400 border border-slate-700 rounded text-[8px] uppercase"> DECCAN </button>
          </div>
        </div>
      </div>

      {/* Candidate Detections Section */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-[11px] font-bold text-white uppercase">CANDIDATE DETECTIONS & FEATURE ATTRIBUTION DOSSIER (4 ANOMALIES)</h2>
          <span className="text-[10px] text-cyan-400 uppercase">TOP MATCH CONFIDENCE: 98.4%</span>
        </div>

        <div className="space-y-3">
          {/* Result Card 1 */}
          <div className="bg-[#0F172A]/40 border border-red-500/30 rounded-lg p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <span className="bg-red-500/20 border border-red-500/50 text-red-400 p-1.5 rounded text-[10px] uppercase font-bold">RANK #1 // CRITICAL</span>
                <div>
                  <h3 className="text-white font-bold text-sm uppercase flex items-center gap-2">
                    <Crosshair size={14} className="text-red-400" /> [TH-2580] NAGARNAR INTEGRATED STEEL COMPLEX
                  </h3>
                  <div className="mt-1">
                    <span className="bg-amber-500/20 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded text-[8px] uppercase">HIGH CANOPY COLLISION RISK</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="bg-green-500/20 border border-green-500/50 text-green-400 px-2 py-1 rounded text-[10px] uppercase font-bold">COSINE SIM: 98.4%</span>
                <span className="text-cyan-400 text-[11px] font-bold uppercase">FRP: 4,898 MW</span>
                <button className="flex items-center gap-1 bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/40 px-3 py-1 rounded text-[10px] uppercase font-bold">
                  <Lock size={10} /> LOCK TARGET
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-4 pt-4 border-t border-slate-700/50">
              <div className="col-span-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">NEURAL ATTENTION WEIGHTS</span>
                  <span className="bg-slate-800 text-slate-300 border border-slate-700 px-1.5 py-0.5 rounded text-[8px] uppercase">5 DOMINANT SENSORS</span>
                </div>
                
                <div className="space-y-3 mt-3">
                  <div>
                    <div className="flex justify-between text-[8px] text-slate-400 mb-1 uppercase">
                      <span>MWIR I4 (3.74μm) RADIANCE</span>
                      <span className="text-amber-400">42%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-[42%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[8px] text-slate-400 mb-1 uppercase">
                      <span>SWIR B12 (2.19μm) ABSORPTION</span>
                      <span className="text-red-400">36%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full w-[36%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[8px] text-slate-400 mb-1 uppercase">
                      <span>ESA CANOPY 10m PROXIMITY</span>
                      <span className="text-green-400">22%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full w-[22%]"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-span-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold mb-2 block">ATTENTION CORRELATION MATRIX</span>
                <div className="grid grid-cols-4 gap-0.5 w-32 h-32 mt-2">
                  {[
                    [1.00, 0.82, 0.94, 0.71], 
                    [0.82, 1.00, 0.80, 0.65], 
                    [0.94, 0.80, 0.79, 0.79], 
                    [0.71, 0.65, 0.79, 1.00]
                  ].map((row, i) => 
                    row.map((val, j) => {
                      let bgClass = "bg-cyan-500/10";
                      if (val === 1.00) bgClass = "bg-cyan-400";
                      else if (val > 0.9) bgClass = "bg-cyan-500/60";
                      else if (val > 0.8) bgClass = "bg-cyan-500/40";
                      else if (val > 0.7) bgClass = "bg-cyan-500/20";
                      
                      return (
                        <div key={`${i}-${j}`} className={`${bgClass} flex items-center justify-center text-[7px] text-slate-900 font-bold`} title={`Value: ${val}`}>
                          {val === 1.00 ? '1.0' : val.toFixed(2)}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              <div className="col-span-1 bg-red-950/20 border border-red-500/20 p-3 rounded flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <AlertOctagon size={14} className="text-red-500" />
                  <span className="text-[10px] text-red-400 uppercase font-bold">COLLISION VERIFICATION</span>
                </div>
                <div className="text-red-400 text-[11px] font-bold mb-1 uppercase">1.4 KM TO SAL FOREST</div>
                <p className="text-[9px] text-slate-400 uppercase leading-relaxed">
                  NEURAL ANALYSIS DETECTS PERIMETER THERMAL BOUNDARY ENCROACHMENT. INFRARED SIGNATURES SUGGEST UNREGISTERED SLAG DUMPING OPERATIONS EXPANDING TOWARDS PROTECTED CANOPY ZONE.
                </p>
              </div>
            </div>
          </div>

          {/* Result Card 2 */}
          <div className="bg-[#0F172A]/40 border border-amber-500/30 rounded-lg p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
            
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <span className="bg-amber-500/20 border border-amber-500/50 text-amber-400 p-1.5 rounded text-[10px] uppercase font-bold">RANK #2 // WILDFIRE FRONT</span>
                <div>
                  <h3 className="text-white font-bold text-sm uppercase flex items-center gap-2">
                    <Crosshair size={14} className="text-amber-400" /> [WF-04] SIMILIPAL SAL FOREST DEEP CANOPY FIRE FRONT
                  </h3>
                  <div className="mt-1">
                    <span className="text-slate-400 text-[9px] uppercase">MAYURBHANJ, ODISHA</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="bg-green-500/20 border border-green-500/50 text-green-400 px-2 py-1 rounded text-[10px] uppercase font-bold">COSINE SIM: 91.2%</span>
                <span className="text-cyan-400 text-[11px] font-bold uppercase">FRP: 1,240 MW</span>
                <button className="flex items-center gap-1 bg-slate-800 border border-slate-600 text-slate-400 hover:text-white px-3 py-1 rounded text-[10px] uppercase font-bold">
                  <Lock size={10} /> LOCK TARGET
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
