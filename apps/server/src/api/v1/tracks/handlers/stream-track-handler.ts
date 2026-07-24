import { createReadStream, statSync } from 'node:fs';
import path from 'node:path';
import { createHandler } from '../../../../utils/create-handler';
import { postService } from '../../../../container';
import { db } from '../../../../db-config';

export const streamTrackHandler = createHandler(async (req, res) => {
  const track = await postService.findTrackById(req.params.id as string, db);
  const filePath = path.join(process.cwd(), 'uploads', `${track.data.filename}`);

  const fileSize = statSync(filePath).size;
  const range = req.headers.range;

  // Browser requested the entire file
  if (!range) {
    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': fileSize,
      'Accept-Ranges': 'bytes',
    });

    createReadStream(filePath).pipe(res);
    return;
  }

  // Example: "bytes=1048576-"
  const [startString, endString] = range.replace('bytes=', '').split('-');

  const start = Number(startString);
  const end = endString ? Number(endString) : fileSize - 1;

  if (Number.isNaN(start) || Number.isNaN(end) || start > end || end >= fileSize) {
    res.status(416).setHeader('Content-Range', `bytes */${fileSize}`);
    res.end();
    return;
  }

  const chunkSize = end - start + 1;

  res.writeHead(206, {
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunkSize,
    'Content-Type': 'audio/mpeg',
  });

  createReadStream(filePath, {
    start,
    end,
  }).pipe(res);
});
