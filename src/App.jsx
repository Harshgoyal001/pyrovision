import React, { useState } from 'react';
import TopHeader from './components/TopHeader';
import Sidebar from './components/Sidebar';
import BottomBar from './components/BottomBar';
import MapView from './components/MapView';
import StatisticsView from './components/StatisticsView';
import LayersView from './components/LayersView';
import ThermalHuntView from './components/ThermalHuntView';
import { useThermalAnomalies } from './hooks/useThermalAnomalies';

const PipelineInfo = () => (
  <div className="flex h-full w-full items-center justify-center bg-[#070A0F] text-slate-400">
    <p>PIPELINE DATA UNAVAILABLE</p>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [searchLocation, setSearchLocation] = useState(null);
  const [layers, setLayers] = useState({
    firms: true,
    industrial: true,
    risk: true,
    worldcover: true,
    buffer: true,
    cloudmask: false,
  });
  const toggleLayer = (key) => setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  const { anomalies, selectedTarget, setSelectedTarget, loading, error, lastFetchedAt, realtimeStatus, stats } = useThermalAnomalies();

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#070A0F] text-slate-200 font-mono flex flex-col">
      <TopHeader anomalies={anomalies} stats={stats} onSearchLocation={setSearchLocation} onSelectAnomaly={setSelectedTarget} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          stats={stats}
          loading={loading}
          error={error}
          lastFetchedAt={lastFetchedAt}
          realtimeStatus={realtimeStatus}
          layers={layers}
        />
        <main className="flex-1 overflow-hidden">
          {activeTab === 'map' && (
            <MapView
              anomalies={anomalies}
              selectedTarget={selectedTarget}
              setSelectedTarget={setSelectedTarget}
              stats={stats}
              searchLocation={searchLocation}
              layers={layers}
              toggleLayer={toggleLayer}
            />
          )}
          {activeTab === 'statistics' && <StatisticsView anomalies={anomalies} stats={stats} />}
          {activeTab === 'layers' && <LayersView stats={stats} />}
          {activeTab === 'thermal-hunt' && <ThermalHuntView anomalies={anomalies} />}
          {activeTab === 'pipeline' && <PipelineInfo />}
        </main>
      </div>
      <BottomBar stats={stats} />
    </div>
  );
}