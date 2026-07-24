import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

export function generateMockPeaks(length = 400) {
  return Array.from({ length }, (_, i) => {
    const envelope = Math.sin((i / length) * Math.PI);
    const variation = 0.4 + Math.abs(Math.sin(i * 0.27)) * 0.35 + Math.random() * 0.15;

    return Math.min(1, envelope * variation + 0.05);
  });
}

export default function SoundCloudWaveform() {
  const containerRef = useRef(null);
  const waveSurferRef = useRef(null);
  const peaks = generateMockPeaks();

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      peaks: [peaks],
      // Appearance
      height: 64,
      waveColor: '#d6d6d6',
      progressColor: '#00BCFF',

      // Make it look like SoundCloud
      barWidth: 2,
      barGap: 1,
      barRadius: 1,

      normalize: true,

      // Hide cursor
      cursorWidth: 0,

      // Improve rendering
      minPxPerSec: 0,
      interact: true,
      duration: 200,
    });

    waveSurferRef.current = ws;

    return () => {
      ws.destroy();
    };
  }, [containerRef.current, peaks]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        cursor: 'pointer',
      }}
    />
  );
}
