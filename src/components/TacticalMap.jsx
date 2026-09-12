import React, { useEffect } from 'react';
import { MapContainer, TileLayer, WMSTileLayer, Circle, CircleMarker, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// Copy these three files into src/assets/icons/ in your project, then this
// import will resolve correctly.
import wildfireFlame from '../assets/icons/WILD_FIRE.png';
import gasFlareFlame from '../assets/icons/GAS_FLARE.png';
import cropBurnFlame from '../assets/icons/CROP_BURN.png';

// Esri World Imagery — real satellite/terrain tiles, free and keyless
// forever, looks like Google Maps' Satellite view.
const TILE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

// Esri's free labels-only overlay — country/state/city names, transparent
// background, drawn on top of the satellite imagery below.
const LABELS_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';

// ESA WorldCover's real public WMS — free, keyless, official land-cover map
// (forest/cropland/water/etc). Used for the "ESA WorldCover 10m" layer toggle.
const WORLDCOVER_WMS_URL = 'https://services.terrascope.be/wms/v2';
const WORLDCOVER_LAYER = 'WORLDCOVER_2021_MAP';

const CATEGORY_COLORS = {
  'Wildfire Front': '#FF003C',
  'Industrial Process': '#F59E0B',
  'Gas Flare': '#00F0FF',
  'Crop Residue Burning': '#22C55E',
};

// Categories that get a real flame image icon instead of a plain dot.
const FLAME_IMAGES = {
  'Wildfire Front': wildfireFlame,
  'Gas Flare': gasFlareFlame,
  'Crop Residue Burning': cropBurnFlame,
};

// Auto-fits the map to all current anomaly points whenever the data changes.
function FitBoundsOnData({ anomalies }) {
  const map = useMap();

  useEffect(() => {
    if (!anomalies || anomalies.length === 0) return;
    const bounds = anomalies.map((a) => [a.latitude, a.longitude]);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 9 });
  }, [anomalies, map]);

  return null;
}

// Flies the map to a searched location (from TopHeader's search box) and
// drops a temporary pin there.
function FlyToSearchLocation({ searchLocation }) {
  const map = useMap();

  useEffect(() => {
    if (!searchLocation) return;
    map.flyTo([searchLocation.lat, searchLocation.lon], 12, { duration: 1.2 });
  }, [searchLocation, map]);

  return null;
}

function searchPinIcon() {
  return L.divIcon({
    className: 'tactical-custom-icon',
    html: `
      <div style="
        width:16px;height:16px;
        border-radius:50% 50% 50% 0;
        background:#00F0FF;
        border:2px solid #0F172A;
        box-shadow:0 0 10px #00F0FFcc;
        transform:rotate(-45deg);
      "></div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 16],
  });
}

function MapLegend() {
  const items = [
    { label: 'WILDFIRE', color: '#FF003C' },
    { label: 'INDUSTRIAL', color: '#F59E0B' },
    { label: 'GAS FLARE', color: '#00F0FF' },
    { label: 'CROP BURN', color: '#22C55E' },
    { label: 'UNCLASSIFIED', color: '#94A3B8' },
  ];

  return (
    <div className="absolute bottom-3 right-3 z-[1000] bg-[#0F172A]/90 border border-slate-700/40 rounded px-2.5 py-2 text-[9px] font-mono text-slate-300 space-y-1 pointer-events-none">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: item.color, boxShadow: `0 0 4px ${item.color}` }}
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// Same severity scaling that used to size the CircleMarker radius — now
// sizes the flame icon in pixels instead.
function getIconSizePx(anomaly) {
  if (anomaly.frp_radiance > 2000) return 38;
  if (anomaly.frp_radiance > 500) return 30;
  return 24;
}

// Builds a Leaflet divIcon: a flame PNG with a soft colored glow, sitting
// on a solid dark backdrop circle (for contrast against busy satellite
// imagery) with a subtle "radar ping" ripple ring (animate-pulse-ring from
// index.css) around it.
function buildFlameIcon(anomaly, glowClass, color) {
  const src = FLAME_IMAGES[anomaly.category];
  const baseSize = getIconSizePx(anomaly);
  const outerSize = Math.round(baseSize * 1.6);
  const flameSize = Math.round(outerSize * 0.55);
  const flameOffset = (outerSize - flameSize) / 2;

  return L.divIcon({
    className: 'tactical-custom-icon',
    html: `
      <div style="position:relative;width:${outerSize}px;height:${outerSize}px;">
        <div class="animate-pulse-ring" style="position:absolute;inset:0;border-radius:50%;background:${color};opacity:0.3;"></div>
        <div style="
          position:absolute;inset:0;
          border-radius:50%;
          background:rgba(7,10,15,0.85);
          border:1.5px solid ${color};
          box-shadow:0 0 8px ${color}99;
        "></div>
        <img src="${src}" class="${glowClass}" style="
          position:absolute;
          top:${flameOffset}px;left:${flameOffset}px;
          width:${flameSize}px;height:${flameSize}px;
          display:block;
        " />
      </div>
    `,
    iconSize: [outerSize, outerSize],
    iconAnchor: [outerSize / 2, outerSize / 2],
    popupAnchor: [0, -outerSize / 2],
  });
}

// Custom cluster bubble — dark tactical style with a cyan ring, showing the
// count of hotspots grouped at this zoom level. Bigger clusters get a
// slightly bigger bubble and the critical-red tint if any member is severe.
function createClusterIcon(cluster) {
  const count = cluster.getChildCount();
  const size = count > 50 ? 46 : count > 15 ? 38 : 30;
  const hasCritical = cluster
    .getAllChildMarkers()
    .some((m) => m.options.__isCritical);
  const ringColor = hasCritical ? '#FF003C' : '#00F0FF';

  return L.divIcon({
    html: `
      <div style="
        width:${size}px;height:${size}px;
        display:flex;align-items:center;justify-content:center;
        background:rgba(15,23,42,0.9);
        border:2px solid ${ringColor};
        border-radius:50%;
        color:${ringColor};
        font-family:'IBM Plex Mono', monospace;
        font-weight:700;
        font-size:${count > 50 ? 13 : 11}px;
        box-shadow:0 0 10px ${ringColor}66;
      ">${count}</div>
    `,
    className: 'tactical-custom-icon',
    iconSize: [size, size],
  });
}

export default function TacticalMap({ anomalies, selectedTarget, setSelectedTarget, searchLocation, layers = {} }) {
  // Sensible defaults if a layer key isn't specified — everything visible
  // except cloud mask (no real Sentinel-2 cloud data connected yet).
  const showFirms = layers.firms !== false;
  const showIndustrial = layers.industrial !== false;
  const showRisk = layers.risk !== false;
  const showWorldcover = Boolean(layers.worldcover);
  const showBuffer = Boolean(layers.buffer);
  // Note: cloudmask has no real effect yet — no free Sentinel-2 L2A cloud
  // mask source is wired in. The checkbox toggles, but nothing changes on
  // the map for it currently.

  const getMarkerColor = (anomaly) => {
    if (anomaly.category === 'Wildfire Front' || anomaly.frp_radiance > 2000) return '#FF003C';
    if (anomaly.category === 'Industrial Process') return '#F59E0B';
    if (anomaly.category === 'Gas Flare') return '#00F0FF';
    if (anomaly.category === 'Crop Residue Burning') return '#22C55E';
    return '#94A3B8';
  };

  const getMarkerRadius = (anomaly) => {
    if (anomaly.frp_radiance > 2000) return 6;
    if (anomaly.frp_radiance > 500) return 5;
    return 4;
  };

  const getGlowClass = (anomaly) => {
    if (anomaly.category === 'Wildfire Front') return 'marker-critical';
    if (anomaly.category === 'Gas Flare') return 'marker-gasflare';
    if (anomaly.category === 'Crop Residue Burning') return 'marker-crop';
    return '';
  };

  const hasData = anomalies && anomalies.length > 0;

  // Split into three groups: flame-icon anomalies get clustered (gated by
  // the "FIRMS Thermal Hotspots" toggle); Industrial Process dots are gated
  // by their own toggle; anything else (Unclassified) follows the FIRMS
  // toggle since it's part of the same raw satellite feed.
  const flameAnomalies = hasData && showFirms ? anomalies.filter((a) => FLAME_IMAGES[a.category]) : [];
  const industrialAnomalies =
    hasData && showIndustrial ? anomalies.filter((a) => a.category === 'Industrial Process') : [];
  const unclassifiedAnomalies =
    hasData && showFirms ? anomalies.filter((a) => !FLAME_IMAGES[a.category] && a.category !== 'Industrial Process') : [];

  const renderPopup = (anomaly, isCritical) => (
    <Popup className="tactical-popup font-mono text-[10px]">
      <div className="bg-[#0F172A] p-2 border border-slate-700 text-slate-300">
        <div className="font-bold text-white mb-1">#{anomaly.id} {anomaly.name}</div>
        {isCritical && (
          <div className="text-red-400 font-bold mb-1 border border-red-500/50 bg-red-500/10 px-1 inline-block">
            CRITICAL SEVERITY
          </div>
        )}
        <div>LAT {anomaly.latitude}, LON {anomaly.longitude} // FRP: {anomaly.frp_radiance} MW</div>
        <div className="text-cyan-400 mt-1 uppercase">{anomaly.category || 'UNKNOWN'}</div>
      </div>
    </Popup>
  );

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer
        center={[20.5, 82.0]}
        zoom={6}
        className="h-full w-full bg-[#070A0F]"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url={TILE_URL} />
        <TileLayer url={LABELS_URL} />
        <ZoomControl position="bottomleft" />

        {hasData && <FitBoundsOnData anomalies={anomalies} />}
        <FlyToSearchLocation searchLocation={searchLocation} />

        {searchLocation && (
          <Marker position={[searchLocation.lat, searchLocation.lon]} icon={searchPinIcon()}>
            <Popup className="tactical-popup font-mono text-[10px]">
              <div className="bg-[#0F172A] p-2 border border-slate-700 text-slate-300 max-w-[200px]">
                {searchLocation.label}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Clustered flame markers: wildfire, gas flare, crop burn */}
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterIcon}
          maxClusterRadius={55}
          spiderfyOnMaxZoom
          showCoverageOnHover={false}
        >
          {flameAnomalies.map((anomaly) => {
            const isCritical = anomaly.frp_radiance > 2000;
            return (
              <React.Fragment key={anomaly.id}>
                {/* Priority Risk Shading: extra pulsing red ring on critical
                    hotspots, only drawn when this layer is engaged. */}
                {isCritical && showRisk && (
                  <CircleMarker
                    center={[anomaly.latitude, anomaly.longitude]}
                    radius={26}
                    pathOptions={{ color: '#FF003C', fillColor: '#FF003C', fillOpacity: 0.12, weight: 1.5, dashArray: '3,4' }}
                  />
                )}
                <Marker
                  position={[anomaly.latitude, anomaly.longitude]}
                  icon={buildFlameIcon(anomaly, getGlowClass(anomaly), getMarkerColor(anomaly))}
                  eventHandlers={{ click: () => setSelectedTarget(anomaly) }}
                  // Read by createClusterIcon to tint the cluster bubble red
                  // if any hotspot inside it is critical severity.
                  __isCritical={isCritical}
                >
                  {renderPopup(anomaly, isCritical)}
                </Marker>
              </React.Fragment>
            );
          })}
        </MarkerClusterGroup>

        {/* ESA WorldCover 10m — real land-cover WMS overlay */}
        {showWorldcover && (
          <WMSTileLayer
            url={WORLDCOVER_WMS_URL}
            layers={WORLDCOVER_LAYER}
            format="image/png"
            transparent
            opacity={0.5}
          />
        )}

        {/* Industrial Process — plain amber dots, gated by its own toggle */}
        {industrialAnomalies.map((anomaly) => (
          <CircleMarker
            key={anomaly.id}
            center={[anomaly.latitude, anomaly.longitude]}
            radius={getMarkerRadius(anomaly)}
            pathOptions={{
              color: getMarkerColor(anomaly),
              fillColor: getMarkerColor(anomaly),
              fillOpacity: 0.4,
              weight: 2,
            }}
            eventHandlers={{ click: () => setSelectedTarget(anomaly) }}
          >
            {renderPopup(anomaly, false)}
          </CircleMarker>
        ))}

        {/* Unclassified — plain grey dots, follows the FIRMS toggle */}
        {unclassifiedAnomalies.map((anomaly) => (
          <CircleMarker
            key={anomaly.id}
            center={[anomaly.latitude, anomaly.longitude]}
            radius={getMarkerRadius(anomaly)}
            pathOptions={{
              color: getMarkerColor(anomaly),
              fillColor: getMarkerColor(anomaly),
              fillOpacity: 0.4,
              weight: 2,
            }}
            eventHandlers={{ click: () => setSelectedTarget(anomaly) }}
          >
            {renderPopup(anomaly, false)}
          </CircleMarker>
        ))}

        {/* Population Density Buffer — 5km radius warning ring around every
            critical hotspot, only drawn when this layer is engaged. */}
        {showBuffer &&
          hasData &&
          anomalies
            .filter((a) => a.frp_radiance > 2000)
            .map((a) => (
              <Circle
                key={`buffer-${a.id}`}
                center={[a.latitude, a.longitude]}
                radius={5000}
                pathOptions={{ color: '#F59E0B', fillColor: '#F59E0B', fillOpacity: 0.06, weight: 1, dashArray: '6,6' }}
              />
            ))}

        {/* Selected target highlight */}
        {selectedTarget && (
          <CircleMarker
            center={[selectedTarget.latitude, selectedTarget.longitude]}
            radius={20}
            pathOptions={{ color: '#00F0FF', fillColor: 'transparent', weight: 1, dashArray: '4, 4' }}
            className="animate-spin-slow"
          />
        )}
      </MapContainer>

      <MapLegend />

      {!hasData && (
        <div className="absolute inset-0 z-[999] flex items-center justify-center pointer-events-none">
          <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase bg-[#070A0F]/70 px-3 py-1.5 border border-slate-700/30 rounded">
            NO ANOMALIES IN FEED
          </span>
        </div>
      )}
    </div>
  );
}