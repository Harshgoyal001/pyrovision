import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Supercluster from 'supercluster';

// Same flame icons used in flat TacticalMap
import wildfireFlame from '../assets/icons/WILD_FIRE.png';
import gasFlareFlame from '../assets/icons/GAS_FLARE.png';
import cropBurnFlame from '../assets/icons/CROP_BURN.png';

// Esri World Imagery (Satellite) & Reference Labels
const ESRI_SAT = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const ESRI_LABELS = 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';

const CATEGORY_COLORS = {
  'Wildfire Front': '#FF003C',
  'Industrial Process': '#F59E0B',
  'Gas Flare': '#00F0FF',
  'Crop Residue Burning': '#22C55E',
};

const FLAME_IMAGES = {
  'Wildfire Front': wildfireFlame,
  'Gas Flare': gasFlareFlame,
  'Crop Residue Burning': cropBurnFlame,
};

function getColor(cat) {
  return CATEGORY_COLORS[cat] || '#94A3B8';
}

function getGlowClass(cat) {
  if (cat === 'Wildfire Front') return 'marker-critical';
  if (cat === 'Gas Flare') return 'marker-gasflare';
  if (cat === 'Crop Residue Burning') return 'marker-crop';
  return '';
}

function getIconSizePx(frp) {
  if (frp > 2000) return 30;
  if (frp > 500) return 24;
  return 18;
}

export default function GlobeView({ anomalies = [], selectedTarget, setSelectedTarget, searchLocation, layers = {}, onMouseMove }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const selectedMarkerRef = useRef(null);
  const searchPinMarkerRef = useRef(null);
  const clusterIndexRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Layer filter toggles (same as flat TacticalMap)
  const showFirms = layers.firms !== false;
  const showIndustrial = layers.industrial !== false;

  const visible = anomalies.filter((a) => {
    if (FLAME_IMAGES[a.category]) return showFirms;
    if (a.category === 'Industrial Process') return showIndustrial;
    return showFirms;
  });

  // 1. Initialize MapLibre 3D Satellite Globe
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        projection: { type: 'globe' },
        sources: {
          satellite: {
            type: 'raster',
            tiles: [ESRI_SAT],
            tileSize: 256,
            attribution: '© Esri',
            maxzoom: 19,
          },
          labels: {
            type: 'raster',
            tiles: [ESRI_LABELS],
            tileSize: 256,
            attribution: '© Esri',
            maxzoom: 19,
          },
        },
        layers: [
          {
            id: 'bg',
            type: 'background',
            paint: { 'background-color': '#02040A' },
          },
          {
            id: 'satellite-layer',
            type: 'raster',
            source: 'satellite',
            minzoom: 0,
            maxzoom: 22,
          },
          {
            id: 'labels-layer',
            type: 'raster',
            source: 'labels',
            minzoom: 0,
            maxzoom: 22,
            paint: { 'raster-opacity': 0.85 },
          },
        ],
      },
      center: [78.96, 20.59], // Centered on India
      zoom: 3.5,
      antialias: true,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-left');
    map.addControl(new maplibregl.GlobeControl(), 'top-left');
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

    map.on('load', () => {
      try {
        map.setProjection({ type: 'globe' });
      } catch (e) {
        console.warn('Globe projection:', e);
      }
      setMapLoaded(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Track live mouse cursor coordinates across the 3D globe
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !onMouseMove) return;

    const handleMove = (e) => {
      if (e?.lngLat) {
        onMouseMove({ lat: e.lngLat.lat, lng: e.lngLat.lng });
      }
    };

    const handleOut = () => {
      onMouseMove(null);
    };

    map.on('mousemove', handleMove);
    map.on('mouseout', handleOut);

    return () => {
      map.off('mousemove', handleMove);
      map.off('mouseout', handleOut);
    };
  }, [mapLoaded, onMouseMove]);

  // 2. Build Supercluster index whenever visible anomalies change
  useEffect(() => {
    const points = [];

    visible.forEach((a) => {
      const lat = Number(a.latitude ?? a.lat_rounded ?? 0);
      const lng = Number(a.longitude ?? a.long_rounded ?? 0);
      if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return;

      points.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        properties: a,
      });
    });

    const index = new Supercluster({
      radius: 50,
      maxZoom: 15,
    });

    index.load(points);
    clusterIndexRef.current = index;
  }, [visible]);

  // 3. Render Clusters & Individual Markers (Combines hotspots when zoomed out)
  const renderMarkers = useCallback(() => {
    const map = mapRef.current;
    const index = clusterIndexRef.current;
    if (!map || !mapLoaded || !index) return;

    // Clear previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const zoom = Math.floor(map.getZoom());
    const clusters = index.getClusters([-180, -85, 180, 85], zoom);

    clusters.forEach((feature) => {
      const [lng, lat] = feature.geometry.coordinates;

      if (feature.properties.cluster) {
        // --- CLUSTER BUBBLE (Combines multiple nearby hotspots) ---
        const count = feature.properties.point_count;
        const clusterId = feature.properties.cluster_id;
        const size = count > 50 ? 46 : count > 15 ? 38 : 30;

        // Check if any hotspot in this cluster is critical
        let hasCritical = false;
        try {
          const leaves = index.getLeaves(clusterId, 30);
          hasCritical = leaves.some((l) => (Number(l.properties.frp_radiance) || 0) > 2000);
        } catch (_) {}

        const ringColor = hasCritical ? '#FF003C' : '#00F0FF';

        const el = document.createElement('div');
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.cursor = 'pointer';
        el.style.display = 'block';

        el.innerHTML = `
          <div style="
            width:100%;height:100%;
            display:flex;align-items:center;justify-content:center;
            background:rgba(15,23,42,0.92);
            border:2px solid ${ringColor};
            border-radius:50%;
            color:${ringColor};
            font-family:'IBM Plex Mono', monospace;
            font-weight:700;
            font-size:${count > 50 ? 13 : 11}px;
            box-shadow:0 0 12px ${ringColor}77;
            transition:transform 0.15s ease;
          ">${count}</div>
        `;

        el.addEventListener('mouseenter', () => {
          el.firstElementChild.style.transform = 'scale(1.2)';
        });
        el.addEventListener('mouseleave', () => {
          el.firstElementChild.style.transform = 'scale(1)';
        });

        // Click to expand cluster & immediately select top hotspot
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          try {
            const leaves = index.getLeaves(clusterId, 10);
            if (leaves && leaves.length > 0) {
              const sorted = [...leaves].sort(
                (x, y) => (Number(y.properties.frp_radiance) || 0) - (Number(x.properties.frp_radiance) || 0)
              );
              setSelectedTarget(sorted[0].properties);
            }
          } catch (_) {}

          try {
            const nextZoom = Math.min(index.getClusterExpansionZoom(clusterId), 16);
            map.flyTo({
              center: [lng, lat],
              zoom: nextZoom,
              duration: 600,
              essential: true,
            });
          } catch (_) {
            map.flyTo({
              center: [lng, lat],
              zoom: map.getZoom() + 2,
              duration: 500,
            });
          }
        });

        const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat([lng, lat])
          .addTo(map);

        markersRef.current.push(marker);
      } else {
        // --- INDIVIDUAL HOTSPOT FLAME MARKER ---
        const a = feature.properties;
        const color = getColor(a.category);
        const isCritical = (Number(a.frp_radiance) || 0) > 2000;
        const flameSrc = FLAME_IMAGES[a.category];

        let outer;
        let popupOffset = 16;

        if (flameSrc) {
          const baseSize = getIconSizePx(a.frp_radiance || 0);
          const outerSize = Math.round(baseSize * 1.4);
          const flameSize = Math.round(outerSize * 0.58);
          const flameOffset = Math.round((outerSize - flameSize) / 2);
          const glowClass = getGlowClass(a.category);
          popupOffset = Math.round(outerSize / 2) + 4;

          outer = document.createElement('div');
          outer.style.width = `${outerSize}px`;
          outer.style.height = `${outerSize}px`;
          outer.style.cursor = 'pointer';
          outer.style.display = 'block';
          outer.style.zIndex = '15';

          outer.innerHTML = `
            <div style="position:relative;width:100%;height:100%;pointer-events:none;">
              <div class="animate-pulse-ring" style="position:absolute;inset:0;border-radius:50%;background:${color};opacity:0.35;"></div>
              <div style="position:absolute;inset:0;border-radius:50%;background:rgba(7,10,15,0.85);border:1.5px solid ${color};box-shadow:0 0 10px ${color}aa;"></div>
              <img src="${flameSrc}" class="${glowClass}" style="position:absolute;top:${flameOffset}px;left:${flameOffset}px;width:${flameSize}px;height:${flameSize}px;display:block;" />
            </div>
          `;
        } else {
          const dotRadius = isCritical ? 7 : 5;
          popupOffset = dotRadius + 6;

          outer = document.createElement('div');
          outer.style.width = `${dotRadius * 2}px`;
          outer.style.height = `${dotRadius * 2}px`;
          outer.style.cursor = 'pointer';
          outer.style.display = 'block';
          outer.style.zIndex = '15';

          outer.innerHTML = `
            <div style="width:100%;height:100%;border-radius:50%;background:${color};box-shadow:0 0 ${isCritical ? 12 : 6}px 2px ${color}cc;border:1.5px solid #0F172A;pointer-events:none;"></div>
          `;
        }

        outer.addEventListener('mouseenter', () => {
          outer.style.transform = `${outer.style.transform || ''} scale(1.35)`;
        });
        outer.addEventListener('mouseleave', () => {
          outer.style.transform = outer.style.transform.replace(' scale(1.35)', '');
        });

        // Tactical Popup (pointer-events: none so clicks go through to outer)
        const popup = new maplibregl.Popup({
          closeButton: false,
          offset: popupOffset,
          className: 'pyro-globe-popup',
        }).setHTML(`
          <div style="pointer-events:none;font-family:'IBM Plex Mono',monospace;font-size:10px;background:#0F172A;border:1px solid #334155;padding:8px 10px;border-radius:4px;color:#CBD5E1;min-width:180px;box-shadow:0 4px 16px rgba(0,0,0,0.7)">
            <div style="font-weight:700;color:#FFFFFF;margin-bottom:4px">#${a.id} ${a.name || ''}</div>
            ${
              isCritical
                ? `<div style="color:#FF003C;font-weight:700;margin-bottom:4px;border:1px solid rgba(255,0,60,0.5);background:rgba(255,0,60,0.1);padding:1px 4px;display:inline-block">CRITICAL SEVERITY</div>`
                : ''
            }
            <div style="font-size:9.5px;color:#94A3B8;line-height:1.4">LAT ${lat.toFixed(4)}°, LON ${lng.toFixed(4)}° // FRP: ${a.frp_radiance} MW</div>
            <div style="color:#00F0FF;margin-top:4px;text-transform:uppercase;font-weight:600">${a.category || 'UNKNOWN'}</div>
          </div>
        `);

        outer.addEventListener('mouseenter', () => popup.addTo(map));
        outer.addEventListener('mouseleave', () => popup.remove());

        // Click to select hotspot & flyTo
        outer.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          setSelectedTarget(a);
          map.flyTo({
            center: [lng, lat],
            zoom: Math.max(map.getZoom(), 7.5),
            duration: 800,
            essential: true,
          });
        });

        const marker = new maplibregl.Marker({ element: outer, anchor: 'center' })
          .setLngLat([lng, lat])
          .addTo(map);

        markersRef.current.push(marker);
      }
    });
  }, [mapLoaded, setSelectedTarget]);

  // Re-render clusters on map move or zoom or when visible list updates
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    renderMarkers();

    map.on('moveend', renderMarkers);
    map.on('zoomend', renderMarkers);

    return () => {
      map.off('moveend', renderMarkers);
      map.off('zoomend', renderMarkers);
    };
  }, [mapLoaded, visible, renderMarkers]);

  // 4. Highlight Selected Target with Targeting Ring
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.remove();
      selectedMarkerRef.current = null;
    }

    if (selectedTarget) {
      const lat = Number(selectedTarget.latitude ?? selectedTarget.lat_rounded ?? 0);
      const lng = Number(selectedTarget.longitude ?? selectedTarget.long_rounded ?? 0);
      if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return;

      const reticle = document.createElement('div');
      reticle.style.width = '42px';
      reticle.style.height = '42px';
      reticle.style.pointerEvents = 'none';
      reticle.style.display = 'block';

      reticle.innerHTML = `
        <div style="width:100%;height:100%;border-radius:50%;border:2px dashed #00F0FF;box-shadow:0 0 16px #00F0FFaa;animation:spin 8s linear infinite;"></div>
      `;

      const selectedMarker = new maplibregl.Marker({ element: reticle, anchor: 'center' })
        .setLngLat([lng, lat])
        .addTo(map);

      selectedMarkerRef.current = selectedMarker;

      map.flyTo({
        center: [lng, lat],
        zoom: Math.max(map.getZoom(), 7.5),
        duration: 900,
        essential: true,
      });
    }
  }, [selectedTarget, mapLoaded]);

  // 5. Fly to Searched Location & Drop Search Pin
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    if (searchPinMarkerRef.current) {
      searchPinMarkerRef.current.remove();
      searchPinMarkerRef.current = null;
    }

    if (searchLocation) {
      const lat = Number(searchLocation.lat);
      const lon = Number(searchLocation.lon);
      if (isNaN(lat) || isNaN(lon) || (lat === 0 && lon === 0)) return;

      // Cyan tactical search pin icon matching TacticalMap
      const pinEl = document.createElement('div');
      pinEl.style.width = '24px';
      pinEl.style.height = '24px';
      pinEl.style.cursor = 'pointer';
      pinEl.style.display = 'block';

      pinEl.innerHTML = `
        <div style="
          width:18px;height:18px;
          border-radius:50% 50% 50% 0;
          background:#00F0FF;
          border:2px solid #0F172A;
          box-shadow:0 0 12px #00F0FFcc;
          transform:rotate(-45deg);
          margin:auto;
        "></div>
      `;

      const popup = new maplibregl.Popup({
        offset: 14,
        className: 'pyro-globe-popup',
      }).setHTML(`
        <div style="font-family:'IBM Plex Mono',monospace;font-size:10px;background:#0F172A;border:1px solid #00F0FF;padding:6px 10px;border-radius:4px;color:#F1F5F9;max-width:220px;box-shadow:0 4px 16px rgba(0,240,255,0.2)">
          <div style="color:#00F0FF;font-weight:700;margin-bottom:2px">SEARCH TARGET</div>
          <div style="font-weight:600">${searchLocation.label || ''}</div>
          <div style="font-size:8.5px;color:#64748B;margin-top:2px">LAT ${lat.toFixed(4)}°, LON ${lon.toFixed(4)}°</div>
        </div>
      `);

      const pinMarker = new maplibregl.Marker({ element: pinEl, anchor: 'bottom' })
        .setLngLat([lon, lat])
        .setPopup(popup)
        .addTo(map);

      popup.addTo(map);
      searchPinMarkerRef.current = pinMarker;

      map.flyTo({
        center: [lon, lat],
        zoom: 11,
        duration: 1200,
        essential: true,
      });
    }
  }, [searchLocation, mapLoaded]);

  return (
    <div className="h-full w-full relative overflow-hidden font-mono select-none bg-[#02040A]">
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="h-full w-full" />

      {/* Tactical Legend */}
      <div className="absolute bottom-8 right-3 z-10 bg-[#0F172A]/90 border border-slate-700/50 rounded px-3 py-2 text-[9px] font-mono text-slate-300 space-y-1.5 pointer-events-none">
        <div className="text-[8px] text-slate-500 uppercase tracking-wider mb-1">TACTICAL LEGEND</div>
        {[
          { label: 'WILDFIRE', color: '#FF003C' },
          { label: 'GAS FLARE', color: '#00F0FF' },
          { label: 'CROP BURN', color: '#22C55E' },
          { label: 'INDUSTRIAL', color: '#F59E0B' },
          { label: 'UNCLASSIFIED', color: '#94A3B8' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: color, boxShadow: `0 0 5px ${color}` }}
            />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Top HUD Badge */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="flex items-center gap-2 bg-[#0F172A]/85 border border-cyan-500/30 px-3 py-1 rounded text-[9px] text-cyan-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>3D SATELLITE GLOBE // {visible.length} HOTSPOTS ACTIVE</span>
        </div>
      </div>

      {/* Style Overrides */}
      <style>{`
        .pyro-globe-popup .maplibregl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
          border: none !important;
        }
        .pyro-globe-popup .maplibregl-popup-tip {
          display: none !important;
        }
        .maplibregl-ctrl-group {
          background: #0F172A !important;
          border: 1px solid #334155 !important;
        }
        .maplibregl-ctrl-group button {
          border-bottom: 1px solid #1E293B !important;
        }
        .maplibregl-ctrl-group button:hover {
          background-color: #1E293B !important;
        }
        .maplibregl-ctrl-icon {
          filter: invert(1) brightness(1.5) !important;
        }
      `}</style>
    </div>
  );
}
