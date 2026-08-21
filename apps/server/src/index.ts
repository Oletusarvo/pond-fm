import express from 'express';
import cors from 'cors';
import http from 'http';
import cookieParser from 'cookie-parser';
import { apiRouter } from './api/api-router';

import { tablenames, viewnames } from './tablenames';
import { db } from './db-config';
import { signCommand } from '@pondfm/crypto';
import { retry } from '@pondfm/server-utils';
import { withTrack } from './DAL/posts/with/with-track';

require('dotenv').config();
const app = express();
const allowedOrigins = ['http://localhost:5173', 'https://pond-fm.onrender.com'];
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, origin || true);
      } else {
        console.log('Disallowed origin', origin);
        return callback(new Error(`Origin ${origin} blocked by CORS!`));
      }
    },
    methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', apiRouter);

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
runCleanup()
  .finally(() => {
    server.listen(PORT, () => {
      console.log('Server listening on port ', PORT);
      setInterval(runCleanup, 1000 * 60 * 60 * 12);
    });
  });

async function runCleanup() {
  console.log('Running cleanup...');
  await db(tablenames.users)
    .where({ status: 'pending' })
    .whereRaw("CURRENT_TIMESTAMP - created_at >= INTERVAL '24h'")
    .del()
    .catch((err) => {
      console.log('Failed to delete expired pending users.', err.stack);
    });

  await cleanupUnusedFilesAndTracks().catch(err => console.log('Failed to delete unused files!', err.stack));
  await db(tablenames.authTokens)
    .where('expires_at', '<=', db.fn.now()).del()
    .catch(err => console.log('Failed to delete expired auth tokens.', err.stack));

  await db(tablenames.uploadTokens)
    .where('expires_at', '<=', db.fn.now())
    .del()
    .catch(err => console.log('Failed to delete expired upload tokens.', err.stack));
}

async function cleanupUnusedFilesAndTracks() {
  const foldersToDelete = await db(tablenames.uploadFolders)
    .where(function () {
      this.where({ status: 'pending_upload' }).orWhere({ status: 'failed_upload' }).orWhere({ status: 'processing_upload' })
        .andWhereRaw("CURRENT_TIMESTAMP - updated_at >= INTERVAL '15min'");
    })
    .orWhere({ status: 'failed_upload' })
    .orWhere({ status: 'deleted' })
    .select(
      'id',
      db.raw("(SELECT JSON_AGG(key) FROM upload.upload_data WHERE upload_folder_id = id) AS keys")
    ) as { id: string; keys: string[] }[];

  if (foldersToDelete.length == 0) {
    return;
  }

  const keys = foldersToDelete.flatMap(f => f.keys);
  const clientId = process.env.LOCAL_UPLOAD_CLIENT_ID;
  const signature = signCommand({
    clientId,
    key: JSON.stringify(keys.sort())
  }, process.env.URL_SIGN_SECRET);

  const signedDeleteUrl = new URL([process.env.CUSTOM_UPLOAD_API, 'upload'].join('/'));
  signedDeleteUrl.searchParams.set('X-Signature', signature);
  signedDeleteUrl.searchParams.set('X-Client-ID', clientId);

  const res = await fetch(signedDeleteUrl, {
    method: 'DELETE', body: JSON.stringify({ keys }), headers: {
      'Content-Type': 'application/json'
    }
  });
  if (res.ok) {
    await retry(async () => await db.transaction(async trx => {
      await trx(tablenames.uploadFolders).whereIn('id', foldersToDelete.map(f => f.id)).del();
    }), {
      retries: 5
    });
  }
}
