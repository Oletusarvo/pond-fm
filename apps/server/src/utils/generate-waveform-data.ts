import { spawn } from 'node:child_process';
import { Readable } from 'node:stream';

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

export async function generateWaveformDataFromBuffer(file: Buffer) {
  const ffmpeg = spawn('ffmpeg', [
    '-i',
    'pipe:0',
    '-ac',
    '1',
    '-ar',
    '8000',
    '-f',
    's16le',
    'pipe:1',
  ]);

  const chunks: Buffer[] = [];

  ffmpeg.stdout.on('data', (chunk) => {
    chunks.push(chunk);
  });

  // Feed the input file to ffmpeg
  ffmpeg.stdin.end(file);
  await new Promise<void>((resolve, reject) => {
    ffmpeg.on('error', reject);

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });
  });

  const pcm = Buffer.concat(chunks);
  const samples = new Int16Array(
    pcm.buffer,
    pcm.byteOffset,
    pcm.length / 2,
  );

  const BAR_COUNT = 1000;
  const windowSize = Math.max(1, Math.floor(samples.length / BAR_COUNT));

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

export async function generateWaveformDataFromStream(
  input: Readable,
  duration: number,
): Promise<number[]> {
  const ffmpeg = spawn("ffmpeg", [
    "-i", "pipe:0",
    "-ac", "1",
    "-ar", "8000",
    "-f", "s16le",
    "pipe:1",
  ]);

  input.pipe(ffmpeg.stdin);

  const BAR_COUNT = 1000;

  const totalSamples = Math.floor(duration * 8000);
  const samplesPerBar = totalSamples / BAR_COUNT;

  let leftover = Buffer.alloc(0);

  const waveform: number[] = [];

  let currentPeak = 0;
  let samplesProcessed = 0;
  let nextBoundary = samplesPerBar;

  for await (const chunk of ffmpeg.stdout) {
    const data = Buffer.concat([leftover, chunk]);

    const sampleCount = Math.floor(data.length / 2);

    for (let i = 0; i < sampleCount; i++) {
      const sample = Math.abs(data.readInt16LE(i * 2));

      currentPeak = Math.max(currentPeak, sample);

      samplesProcessed++;

      if (samplesProcessed >= nextBoundary) {
        waveform.push(currentPeak / 32768);

        currentPeak = 0;
        nextBoundary += samplesPerBar;
      }
    }

    leftover = data.subarray(sampleCount * 2);
  }

  if (currentPeak > 0 && waveform.length < BAR_COUNT) {
    waveform.push(currentPeak / 32768);
  }

  while (waveform.length < BAR_COUNT) {
    waveform.push(0);
  }

  await new Promise<void>((resolve, reject) => {
    ffmpeg.on("error", reject);

    ffmpeg.on("close", (code) => {
      code === 0
        ? resolve()
        : reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });

  return waveform;
}
