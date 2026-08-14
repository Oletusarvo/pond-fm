import express from 'express';
import cors from 'cors';
import http from 'http';
import cookieParser from 'cookie-parser';
import { apiRouter } from './api/api-router';

import { tablenames } from './tablenames';
import { db } from './db-config';
import { signCommand } from '@pondfm/crypto';

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

  await cleanupUnusedFiles().catch(err => console.log('Failed to delete unused files!', err.stack));
  await db(tablenames.authTokens)
    .where('expires_at', '<=', db.fn.now()).del()
    .catch(err => console.log('Failed to delete expired auth tokens.', err.stack));

  await db(tablenames.uploadTokens)
    .where('expires_at', '<=', db.fn.now())
    .del()
    .catch(err => console.log('Failed to delete expired upload tokens.', err.stack));
}

async function cleanupUnusedFiles() {
  const keys = await db(tablenames.uploads)
    .where(function () {
      this.where({ status: 'pending' })
        .whereRaw("CURRENT_TIMESTAMP - updated_at >= INTERVAL '15min'");
    })
    .orWhere({ status: 'failed' })
    .select('key')
    .pluck('key');

  const clientId = process.env.LOCAL_UPLOAD_CLIENT_ID;
  const signature = signCommand({
    clientId,
  }, process.env.URL_SIGN_SECRET);

  const signedDeleteUrl = new URL([process.env.CUSTOM_UPLOAD_API, 'upload'].join('/'));
  signedDeleteUrl.searchParams.set('X-Signature', signature);
  signedDeleteUrl.searchParams.set('X-Client-ID', clientId);

  const res = await fetch(signedDeleteUrl, { method: 'DELETE', body: JSON.stringify(keys) });
  if (res.ok) {
    await db(tablenames.uploads).whereIn('key', keys).del();
  }

}
