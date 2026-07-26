import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

import React from 'react';

type WaveformProps = {
  waveform: number[];
  duration: number;
  playbackPosition: number;
  onWaveformClicked?: (currentTime: number) => void;
};

export default React.memo(function Waveform({
  duration,
  waveform,
  playbackPosition,
  onWaveformClicked,
}: WaveformProps) {
  const containerRef = useRef(null);
  const waveSurferRef = useRef<WaveSurfer>(null);
  console.log('Rendering waveform');
  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      peaks: [waveform],
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
      duration,
    });
    ws.on('click', t => {
      const currentTime = t * duration;
      onWaveformClicked(currentTime);
    });

    waveSurferRef.current = ws;

    return () => {
      ws.destroy();
    };
  }, [containerRef.current]);

  useEffect(() => {
    if (!waveSurferRef.current) {
      return;
    }
    waveSurferRef.current.setTime(playbackPosition);
  }, [playbackPosition]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        cursor: 'pointer',
      }}
    />
  );
});
