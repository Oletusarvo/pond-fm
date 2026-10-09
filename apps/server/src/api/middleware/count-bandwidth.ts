import { createMiddleware } from "@pondfm/server-utils";
import { db } from "../../db-config";
import { tablenames } from "../../tablenames";

export const bandwidthCounter = createMiddleware(async (req, res: any, next) => {
  let bodyBytes = 0;

  const originalWrite = res.write;
  const originalEnd = res.end;

  res.write = function (chunk, encoding, callback) {
    if (chunk != null) {
      bodyBytes += Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(chunk, encoding);
    }

    return originalWrite.call(this, chunk, encoding, callback);
  };

  res.end = function (chunk, encoding, callback) {
    if (chunk != null) {
      bodyBytes += Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(chunk, encoding);
    }

    return originalEnd.call(this, chunk, encoding, callback);
  };

  res.once("finish", () => {
    // Approximate HTTP header bytes.
    const headerBytes = Buffer.byteLength(
      `HTTP/${req.httpVersion} ${res.statusCode}\r\n` +
        Object.entries(res.getHeaders())
          .map(([name, value]) => `${name}: ${Array.isArray(value) ? value.join(", ") : value}\r\n`)
          .join("") +
        "\r\n",
    );

    // Simple heuristic, not an exact measurement of network overhead.
    const estimatedBytes = Math.ceil((bodyBytes + headerBytes) * 1.1);

    db(tablenames.bandwidthData)
      .increment("total_estimated_bytes", estimatedBytes)
      .update({ updated_at: db.fn.now() })
      .catch((err) => console.log("Failed to update bandwidth usage!", err.message));
  });

  next();
});
