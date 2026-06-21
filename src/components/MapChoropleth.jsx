"use client";

import { useMemo, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { mfaData, clusterColors } from "@/data/mfa-data";
import geoData from "@/data/indonesia-38-provinces.json";

export default function MapChoropleth() {
  const [colorMode, setColorMode] = useState("cluster");

  const clusterStats = useMemo(() => {
    const stats = {};
    mfaData.forEach(dataEntry => {
      const activeCluster = colorMode === "cluster" 
        ? dataEntry.cluster 
        : dataEntry.blockClusters?.[colorMode];
      
      if (activeCluster) {
        stats[activeCluster] = (stats[activeCluster] || 0) + 1;
      }
    });
    return stats;
  }, [colorMode]);

  // Normalize province names for matching between GeoJSON and our data
  const normalizeName = (name) => {
    if (!name) return "";
    let n = name.toUpperCase().trim();
    // GeoJSON uses "Daerah Istimewa Yogyakarta", data uses "Di Yogyakarta"
    if (n === "DAERAH ISTIMEWA YOGYAKARTA") return "DI YOGYAKARTA";
    return n;
  };

  const getStyle = (feature) => {
    const rawName = feature.properties.PROVINSI;
    const normalizedName = normalizeName(rawName);
    const dataEntry = mfaData.find((d) => normalizeName(d.province) === normalizedName);
    
    let fillColor = "#e2e8f0"; // light gray for missing
    
    if (dataEntry) {
      const activeCluster = colorMode === "cluster" 
        ? dataEntry.cluster 
        : dataEntry.blockClusters?.[colorMode];
        
      fillColor = clusterColors[activeCluster] || fillColor;
    }

    return {
      fillColor,
      weight: 1,
      opacity: 1,
      color: "white",
      dashArray: "",
      fillOpacity: 1,
    };
  };

  const onEachFeature = (feature, layer) => {
    const rawName = feature.properties.PROVINSI;
    const normalizedName = normalizeName(rawName);
    const dataEntry = mfaData.find((d) => normalizeName(d.province) === normalizedName);
    
    if (dataEntry) {
      const activeCluster = colorMode === "cluster" 
        ? dataEntry.cluster 
        : dataEntry.blockClusters?.[colorMode];

      const blockLabel = {
        infrastruktur: "Infrastruktur",
        ekonomi: "Ekonomi",
        sosdem: "Sosial Demografi",
        prodkons: "Produksi & Konsumsi",
        flw: "Food Loss & Waste"
      }[colorMode];

      const modeTitle = colorMode === "cluster" 
        ? "Kluster Keseluruhan" 
        : `Kluster Blok ${blockLabel}`;

      layer.bindTooltip(`
        <div class="p-2 min-w-[200px]">
          <strong class="text-indigo-700 block mb-2 border-b pb-1">${dataEntry.province}</strong>
          <div class="text-xs space-y-1">
            <div class="flex items-center mb-2">
              <span class="inline-block w-3 h-3 rounded-full mr-2" style="background-color: ${clusterColors[activeCluster] || '#ccc'}"></span>
              <span class="font-bold text-[13px]">${activeCluster}</span>
              <span class="ml-1 text-gray-500">(${modeTitle})</span>
            </div>
            <div class="flex justify-between ${colorMode === 'infrastruktur' ? 'font-bold text-indigo-700' : ''}">
              <span>Infrastruktur:</span> <span>${dataEntry.blocks.infrastruktur.toFixed(1)}</span>
            </div>
            <div class="flex justify-between ${colorMode === 'ekonomi' ? 'font-bold text-indigo-700' : ''}">
              <span>Ekonomi:</span> <span>${dataEntry.blocks.ekonomi.toFixed(1)}</span>
            </div>
            <div class="flex justify-between ${colorMode === 'sosdem' ? 'font-bold text-indigo-700' : ''}">
              <span>SosDem:</span> <span>${dataEntry.blocks.sosdem.toFixed(1)}</span>
            </div>
            <div class="flex justify-between ${colorMode === 'prodkons' ? 'font-bold text-indigo-700' : ''}">
              <span>Prod & Kons:</span> <span>${dataEntry.blocks.prodkons.toFixed(1)}</span>
            </div>
            <div class="flex justify-between ${colorMode === 'flw' ? 'font-bold text-indigo-700' : ''}">
              <span>Lingkungan (FLW):</span> <span>${dataEntry.blocks.flw.toFixed(1)}</span>
            </div>
          </div>
        </div>
      `, {
        sticky: true,
        className: 'bg-white rounded-xl shadow-lg border border-gray-100',
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-lg font-bold text-indigo-600">Peta Sebaran Wilayah</h3>
        <select 
          value={colorMode} 
          onChange={(e) => setColorMode(e.target.value)}
          className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none cursor-pointer"
        >
          <option value="cluster">Berdasarkan Keseluruhan Kluster</option>
          <option value="infrastruktur">Berdasarkan Blok Infrastruktur</option>
          <option value="ekonomi">Berdasarkan Blok Ekonomi</option>
          <option value="sosdem">Berdasarkan Blok Sosial Demografi</option>
          <option value="prodkons">Berdasarkan Blok Produksi & Konsumsi</option>
          <option value="flw">Berdasarkan Blok Food Loss & Waste</option>
        </select>
      </div>

      <div className="w-full h-[calc(100vh-200px)] rounded-xl overflow-hidden bg-[#e2e8f0] relative z-0">
        <MapContainer 
          center={[-2, 118]} 
          zoom={5.5} 
          zoomSnap={0.25}
          scrollWheelZoom={false} 
          style={{ height: "100%", width: "100%", background: "#e2e8f0" }}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          />
          <GeoJSON 
            key={colorMode}
            data={geoData} 
            style={getStyle} 
            onEachFeature={onEachFeature} 
          />
        </MapContainer>

        {/* Legend & Summary Panel */}
        <div className="absolute bottom-6 left-6 z-[1000] bg-white px-5 py-4 rounded-xl shadow-md border border-gray-100 pointer-events-auto">
          <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Statistik Ringkas</h4>
          <div className="space-y-2">
            {Object.keys(clusterColors).map(clusterKey => {
              const count = clusterStats[clusterKey] || 0;
              if (count === 0) return null;
              return (
                <div key={clusterKey} className="flex items-center justify-between gap-6 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: clusterColors[clusterKey] }}></span>
                    <span className="font-bold text-gray-800">{clusterKey}</span>
                  </div>
                  <span className="text-gray-500">{count} Prov</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
