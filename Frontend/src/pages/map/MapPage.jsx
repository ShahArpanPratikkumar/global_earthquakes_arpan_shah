import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import earthquakeService from '../../services/earthquakeService';
import { getRiskColor, getMagnitudeLabel } from '../../utils/riskCalculator';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapPage() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [selected,    setSelected]    = useState(null);
  const [minMag,      setMinMag]      = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await earthquakeService.getTopByMagnitude(1, 100);
        setEarthquakes(res?.data || []);
      } catch (err) {
        console.error("Failed to fetch earthquakes for map:", err);
        setEarthquakes([]);
      } finally { setLoading(false); }
    })();
  }, []);

  const filtered = earthquakes.filter((eq) => parseFloat(eq.mag) >= minMag);



  const getMarkerR = (mag) => {
    const m = parseFloat(mag);
    if (m >= 7) return 9;
    if (m >= 6) return 7;
    if (m >= 5) return 5;
    if (m >= 4) return 3.5;
    return 2;
  };

  return (
    <div className="min-h-screen bg-earth-950 text-earth-100">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-6">
        <h1 className="section-title text-earth-100 mb-2">🗺️ Live Earthquake Map</h1>
        <p className="section-subtitle">
          Showing <span className="text-earth-300 font-semibold">{filtered.length}</span> seismic events
          — color-coded by magnitude intensity
        </p>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-6 mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 earth-glass-dark rounded-xl px-4 py-2.5 border border-earth-700/40">
          <label className="text-earth-400 text-sm font-medium whitespace-nowrap">Min Magnitude</label>
          <input
            type="range" min={0} max={8} step={0.5} value={minMag}
            onChange={(e) => setMinMag(parseFloat(e.target.value))}
            className="w-28 accent-earth-400"
          />
          <span className="text-earth-300 font-bold text-sm w-8">M{minMag}</span>
        </div>

        {/* Legend */}
        <div className="flex gap-3 flex-wrap">
          {[
            { label: '< M3',  color: '#22c55e' },
            { label: 'M3–5', color: '#84cc16' },
            { label: 'M5–6', color: '#f97316' },
            { label: 'M6–7', color: '#ef4444' },
            { label: 'M7+',  color: '#9f1239' },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5 text-xs text-earth-400">
              <div className="w-3 h-3 rounded-full" style={{ background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="relative rounded-2xl overflow-hidden border border-earth-700/40 bg-earth-900 z-0">
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-earth-400 border-t-transparent animate-spin" />
                <p className="text-earth-500 text-sm">Loading seismic data…</p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="h-96 flex flex-col items-center justify-center text-earth-500">
              <span className="text-4xl mb-4">📭</span>
              <p>No seismic events found matching your criteria.</p>
            </div>
          ) : (
            <div className="h-[500px] w-full">
              <MapContainer 
                center={[20, 0]} 
                zoom={2} 
                scrollWheelZoom={true} 
                style={{ height: '100%', width: '100%', background: '#0a1628' }}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                {filtered.map((eq) => {
                  const lat = parseFloat(eq.latitude);
                  const lon = parseFloat(eq.longitude);
                  if (isNaN(lat) || isNaN(lon)) return null;
                  
                  const r = getMarkerR(eq.mag) * 2;
                  const color = getRiskColor(eq.mag);
                  const isSelected = selected?._id === eq._id;

                  return (
                    <CircleMarker
                      key={eq._id}
                      center={[lat, lon]}
                      radius={isSelected ? r * 1.5 : r}
                      pathOptions={{
                        color: isSelected ? '#fff' : color,
                        fillColor: color,
                        fillOpacity: 0.7,
                        weight: isSelected ? 2 : 1
                      }}
                      eventHandlers={{
                        click: () => setSelected(isSelected ? null : eq),
                      }}
                    >
                      <Popup className="earth-leaflet-popup">
                        <div className="p-1">
                          <h4 className="font-bold text-sm mb-1" style={{ color }}>M {parseFloat(eq.mag).toFixed(1)}</h4>
                          <p className="text-xs text-slate-600 mb-2">{eq.place}</p>
                          <div className="text-[10px] text-slate-500 mb-2">
                            {new Date(eq.time).toLocaleString()}
                          </div>
                          <Link to={`/earthquake/${eq._id}`} className="text-xs font-semibold text-blue-600 hover:underline">
                            View Details →
                          </Link>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </MapContainer>
            </div>
          )}
        </div>
      </div>

      {/* Selected earthquake detail */}
      {selected && (
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="earth-glass-dark rounded-2xl p-5 border border-earth-600/40 flex items-start justify-between gap-4">
            <div className="flex gap-4 items-start">
              <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center font-bold font-display"
                style={{ background: getRiskColor(selected.mag) + '30', color: getRiskColor(selected.mag) }}>
                M{parseFloat(selected.mag).toFixed(1)}
              </div>
              <div>
                <h3 className="text-earth-100 font-semibold">{selected.place || 'Unknown Location'}</h3>
                <div className="flex flex-wrap gap-4 mt-1 text-sm text-earth-400">
                  <span>📍 {parseFloat(selected.latitude).toFixed(3)}°, {parseFloat(selected.longitude).toFixed(3)}°</span>
                  <span>⬇️ {selected.depth} km depth</span>
                  <span>📅 {new Date(selected.time).toLocaleString()}</span>
                  <span>📡 Network: {selected.net}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to={`/earthquake/${selected._id}`} className="earth-btn-primary text-xs px-3 py-1.5">Details →</Link>
              <button onClick={() => setSelected(null)} className="text-earth-500 hover:text-earth-300 transition-colors text-lg">✕</button>
            </div>
          </div>
        </div>
      )}

      {/* Top earthquakes table */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="font-display text-xl font-bold text-earth-200 mb-4">Top Seismic Events (by Magnitude)</h2>
        <div className="earth-glass-dark rounded-2xl border border-earth-700/40 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-earth-700/60">
              <tr className="text-earth-400 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Magnitude</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Depth</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Date</th>
                <th className="px-4 py-3 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 20).map((eq, i) => (
                <tr key={eq._id}
                  className={`border-b border-earth-800/30 last:border-0 transition-colors cursor-pointer
                    ${selected?._id === eq._id ? 'bg-earth-700/20' : 'hover:bg-earth-800/20'}`}
                  onClick={() => setSelected(eq)}>
                  <td className="px-4 py-3">
                    <span className="font-bold font-display text-base" style={{ color: getRiskColor(eq.mag) }}>
                      M {parseFloat(eq.mag).toFixed(1)}
                    </span>
                    <span className="ml-2 text-xs text-earth-500">{getMagnitudeLabel(eq.mag)}</span>
                  </td>
                  <td className="px-4 py-3 text-earth-300 truncate max-w-xs">{eq.place || 'Unknown'}</td>
                  <td className="px-4 py-3 text-earth-400 hidden md:table-cell">{eq.depth} km</td>
                  <td className="px-4 py-3 text-earth-500 hidden lg:table-cell">{new Date(eq.time).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Link to={`/earthquake/${eq._id}`} className="text-earth-400 hover:text-earth-200 transition-colors text-xs">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
