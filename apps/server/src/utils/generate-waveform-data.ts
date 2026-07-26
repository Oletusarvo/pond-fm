import { spawn } from 'node:child_process';

export async function generateWaveformData(filePath: string) {
  const ffmpeg = spawn('ffmpeg', [
    '-i',
    filePath,
    '-ac',
    '1',
    '-ar',
    '8000',
    '-f',
    's16le',
    'pipe:1',
  ]);
  const chunks: Buffer[] = [];

  ffmpeg.stdout.on('data', chunk => {
    chunks.push(chunk);
  });

  await new Promise((resolve, reject) => {
    ffmpeg.on('close', resolve);
    ffmpeg.on('error', reject);
  });

  const pcm = Buffer.concat(chunks);
  const samples = new Int16Array(pcm.buffer, pcm.byteOffset, pcm.length / 2);

  const BAR_COUNT = 1000;
  const windowSize = Math.floor(samples.length / BAR_COUNT);

  const waveform: number[] = [];

  for (let i = 0; i < BAR_COUNT; i++) {
    let peak = 0;

    const start = i * windowSize;
    const end = Math.min(start + windowSize, samples.length);

    for (let j = start; j < end; j++) {
      peak = Math.max(peak, Math.abs(samples[j]));
    }

    waveform.push(peak / 32768);
  }

  return waveform;
}
