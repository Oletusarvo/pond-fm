import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

type WaveformProps = {
  waveform: number[];
  duration: number;
  playbackPosition: number;
  onWaveformClicked?: (currentTime: number) => void;
};

export const Waveform = React.memo(function Waveform({
  duration,
  waveform,
  playbackPosition,
  onWaveformClicked,
}: WaveformProps) {
  const containerRef = useRef(null);
  const waveSurferRef = useRef<WaveSurfer>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    waveSurferRef.current = WaveSurfer.create({
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

    return () => {
      waveSurferRef.current.destroy();
    };
  }, []);

  useEffect(() => {
    if (!waveSurferRef.current) {
      return;
    }
    const unsubscribe = waveSurferRef.current.on('ready', () =>
      waveSurferRef.current.setTime(playbackPosition),
    );
    waveSurferRef.current.setTime(playbackPosition);
    return () => {
      unsubscribe();
    };
  }, [playbackPosition]);

  useEffect(() => {
    if (!waveSurferRef.current) return;
    const unsubscribe = waveSurferRef.current.on('click', t => {
      const currentTime = t * duration;
      onWaveformClicked(currentTime);
    });

    return () => {
      unsubscribe();
    };
  }, [onWaveformClicked]);

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
