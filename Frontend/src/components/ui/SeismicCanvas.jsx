import { useEffect, useRef } from 'react';

/**
 * Generates a unique seismic waveform canvas image per news card.
 * Seed is derived from the date string so the same date always renders
 * the same waveform (deterministic), but each date looks different.
 *
 * Props:
 *   dayId   – "YYYY-MM-DD" string (used as RNG seed)
 *   maxMag  – peak magnitude (controls amplitude & color)
 *   count   – total event count (controls noise density)
 *   className – extra tailwind classes
 */
export default function SeismicCanvas({ dayId, maxMag, count, className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // ── Deterministic RNG seeded from the date string ─────────────────────────
    let seed = 0;
    for (let i = 0; i < dayId.length; i++) {
      seed = (seed * 31 + dayId.charCodeAt(i)) >>> 0;
    }
    const rng = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 0xffffffff;
    };

    // ── Colour palette based on magnitude ─────────────────────────────────────
    let accentColor, glowColor, bgGradientTop, bgGradientBot;
    if (maxMag >= 7) {
      accentColor    = '#ef4444';
      glowColor      = 'rgba(239,68,68,0.35)';
      bgGradientTop  = '#1a0606';
      bgGradientBot  = '#2d0a0a';
    } else if (maxMag >= 5.5) {
      accentColor    = '#f97316';
      glowColor      = 'rgba(249,115,22,0.35)';
      bgGradientTop  = '#1a0e06';
      bgGradientBot  = '#2d1a06';
    } else if (maxMag >= 4) {
      accentColor    = '#eab308';
      glowColor      = 'rgba(234,179,8,0.3)';
      bgGradientTop  = '#18130a';
      bgGradientBot  = '#251e0e';
    } else {
      accentColor    = '#60a5fa';
      glowColor      = 'rgba(96,165,250,0.25)';
      bgGradientTop  = '#06101a';
      bgGradientBot  = '#0a1825';
    }

    // ── Background ─────────────────────────────────────────────────────────────
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, bgGradientTop);
    bg.addColorStop(1, bgGradientBot);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // ── Grid lines ─────────────────────────────────────────────────────────────
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let gx = 0; gx <= W; gx += 40) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
    }
    for (let gy = 0; gy <= H; gy += 20) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
    }

    // ── Baseline ───────────────────────────────────────────────────────────────
    const midY = H / 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(W, midY); ctx.stroke();

    // ── Waveform parameters driven by magnitude & event count ─────────────────
    const amplitude   = Math.min((maxMag / 10) * H * 0.85, H * 0.44);
    const noiseEvents = Math.min(count, 60);
    const segments    = W;

    // Build waveform Y-values
    const waveY = new Float32Array(segments);

    // Low-frequency carrier (background tremor)
    const carrierFreq  = 0.012 + rng() * 0.008;
    const carrierPhase = rng() * Math.PI * 2;

    for (let x = 0; x < segments; x++) {
      const t = x / segments;
      let y   = Math.sin(carrierFreq * x + carrierPhase) * amplitude * 0.08;

      // Gaussian bursts simulating individual quake events
      for (let e = 0; e < noiseEvents; e++) {
        const center = (rng() * 0.8 + 0.1) * segments;  // avoid edges
        const width  = 8 + rng() * 20;
        const height = (0.3 + rng() * 0.7) * amplitude * (rng() > 0.85 ? 1 : 0.5);
        const sign   = rng() > 0.5 ? 1 : -1;
        const distSq = (x - center) ** 2;
        y += sign * height * Math.exp(-distSq / (2 * width * width));
      }

      // Main P-wave + S-wave spike at ~30 % and ~55 % of the waveform
      const pCenter = segments * 0.30;
      const sCenter = segments * 0.55;
      const spikeW  = 10 + rng() * 8;
      y += amplitude * 0.9  * Math.exp(-((x - pCenter) ** 2) / (2 * spikeW ** 2));
      y -= amplitude * 0.65 * Math.exp(-((x - pCenter) ** 2) / (2 * (spikeW * 1.5) ** 2));
      y += amplitude * 1.05 * Math.exp(-((x - sCenter) ** 2) / (2 * spikeW ** 2));
      y -= amplitude * 0.75 * Math.exp(-((x - sCenter) ** 2) / (2 * (spikeW * 1.6) ** 2));

      waveY[x] = midY - y;
    }

    // ── Glow shadow pass ──────────────────────────────────────────────────────
    ctx.save();
    ctx.shadowColor  = glowColor;
    ctx.shadowBlur   = 12;
    ctx.strokeStyle  = accentColor;
    ctx.lineWidth    = 1;
    ctx.globalAlpha  = 0.4;
    ctx.beginPath();
    ctx.moveTo(0, waveY[0]);
    for (let x = 1; x < segments; x++) ctx.lineTo(x, waveY[x]);
    ctx.stroke();
    ctx.restore();

    // ── Main waveform line ────────────────────────────────────────────────────
    ctx.save();
    ctx.shadowColor  = glowColor;
    ctx.shadowBlur   = 6;
    ctx.strokeStyle  = accentColor;
    ctx.lineWidth    = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, waveY[0]);
    for (let x = 1; x < segments; x++) ctx.lineTo(x, waveY[x]);
    ctx.stroke();
    ctx.restore();

    // ── Fill under waveform ───────────────────────────────────────────────────
    const fill = ctx.createLinearGradient(0, midY - amplitude, 0, midY + amplitude);
    fill.addColorStop(0, accentColor + '22');
    fill.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.moveTo(0, midY);
    for (let x = 0; x < segments; x++) ctx.lineTo(x, waveY[x]);
    ctx.lineTo(segments - 1, midY);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();

    // ── HUD overlay — magnitude & date ───────────────────────────────────────
    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = accentColor;
    ctx.fillText(`MAG: ${parseFloat(maxMag).toFixed(1)} Mw`, 10, 16);

    ctx.font = '9px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillText(dayId, 10, H - 8);

    // Station ID watermark (top-right)
    ctx.font = '8px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.textAlign = 'right';
    ctx.fillText('GeoSentinel · SEISMOGRAPH', W - 8, 16);
    ctx.textAlign = 'left';

    // ── Amplitude scale bar (left edge) ──────────────────────────────────────
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth   = 0.5;
    const scaleX    = 4;
    ctx.beginPath();
    ctx.moveTo(scaleX, midY - amplitude * 0.6);
    ctx.lineTo(scaleX, midY + amplitude * 0.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(scaleX - 2, midY - amplitude * 0.6);
    ctx.lineTo(scaleX + 2, midY - amplitude * 0.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(scaleX - 2, midY + amplitude * 0.6);
    ctx.lineTo(scaleX + 2, midY + amplitude * 0.6);
    ctx.stroke();

  }, [dayId, maxMag, count]);

  return (
    <canvas
      ref={canvasRef}
      width={512}
      height={192}
      className={`w-full h-full ${className}`}
      aria-label={`Seismic waveform for ${dayId}`}
    />
  );
}
