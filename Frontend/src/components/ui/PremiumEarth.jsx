import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

export default function PremiumEarth({ 
  width = 400, 
  height = 400, 
  markers = [], 
  autoRotate = true,
  autoRotateSpeed = 1
}) {
  const globeRef = useRef();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && globeRef.current && autoRotate) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = autoRotateSpeed;
      globeRef.current.controls().enableZoom = false;
      
      // Initial viewpoint
      globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2 });
    }
  }, [mounted, autoRotate, autoRotateSpeed]);

  if (!mounted) return <div style={{ width, height }} className="rounded-full bg-earth-900/50 animate-pulse" />;

  // Format markers if any
  const globeData = markers.map(m => ({
    lat: m.lat,
    lng: m.lng,
    size: m.mag ? Math.max(0.1, (m.mag - 3) * 0.1) : 0.1,
    color: m.mag >= 6 ? '#ef4444' : m.mag >= 4 ? '#f97316' : '#eab308'
  }));

  return (
    <div className="relative rounded-full overflow-hidden shadow-[0_0_80px_rgba(193,154,107,0.15)] flex items-center justify-center cursor-move" style={{ width, height }}>
      {/* Fallback glow background behind globe */}
      <div className="absolute inset-0 rounded-full bg-earth-900/30 blur-md"></div>
      
      <div style={{ transform: 'scale(1.05)' }}>
        <Globe
          ref={globeRef}
          width={width}
          height={height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          pointsData={globeData}
          pointAltitude="size"
          pointColor="color"
          pointRadius={0.5}
          pointsMerge={true}
          atmosphereColor="#C19A6B"
          atmosphereAltitude={0.15}
        />
      </div>
      
      {/* Overlay Rings for aesthetics */}
      <div className="absolute inset-0 rounded-full border border-earth-500/20 pointer-events-none"></div>
      <div className="absolute inset-[-20px] rounded-full border border-earth-700/10 pointer-events-none"></div>
    </div>
  );
}
