import express from 'express';
import http from 'http';
import { v1Router } from './api/v1/v1Router';
import cors from 'cors';

const allowedOrigins = ['http://localhost:5173', 'https://www.amplitune.com'];
const app = express();
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
    methods: ['GET', 'PUT', 'DELETE'],
    credentials: true,
  }),
);
app.use(express.json());
app.use('/api/v1', v1Router);
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log('Upload server listening on ', PORT);
})