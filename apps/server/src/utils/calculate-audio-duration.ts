import { spawn } from "node:child_process";
import { Readable } from "node:stream";

export function getDuration(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn("ffprobe", [
      "-v", "error",
      "-show_entries", "format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1",
      url,
    ]);

    let output = "";
    let error = "";

    ffprobe.stdout.on("data", chunk => {
      output += chunk;
    });

    ffprobe.stderr.on("data", chunk => {
      error += chunk;
    });

    ffprobe.on("close", code => {
      if (code !== 0) {
        reject(new Error(error || `ffprobe exited with ${code}`));
        return;
      }

      const duration = Number.parseFloat(output);

      if (!Number.isFinite(duration)) {
        reject(new Error("Could not determine audio duration"));
        return;
      }

      resolve(duration);
    });
  });
}

export function getDurationFromStream(stream: Readable): Promise<number> {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn("ffprobe", [
      "-v", "error",
      "-i", "pipe:0",
      "-show_entries", "format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1",
    ]);

    let output = "";
    let error = "";

    ffprobe.stdout.setEncoding("utf8");
    ffprobe.stderr.setEncoding("utf8");

    ffprobe.stdout.on("data", chunk => {
      output += chunk;
    });

    ffprobe.stderr.on("data", chunk => {
      error += chunk;
    });

    ffprobe.on("close", code => {
      if (code !== 0) {
        reject(new Error(error || `ffprobe exited with ${code}`));
        return;
      }

      const duration = Number.parseFloat(output);

      if (!Number.isFinite(duration)) {
        reject(new Error("Could not determine audio duration"));
        return;
      }

      resolve(duration);
    });

    stream.on("error", reject);

    stream.pipe(ffprobe.stdin);
  });
}