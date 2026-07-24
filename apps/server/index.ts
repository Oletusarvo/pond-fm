import express from 'express';
import cors from 'cors';
import http from 'http';
import cookieParser from 'cookie-parser';
import { apiRouter } from './src/api/api-router';
require('dotenv').config();
const app = express();
const allowedOrigins = ['http://localhost:5173', 'https://www.amplitune.com'];
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
server.listen(PORT, () => {
  console.log('Server listening on port ', PORT);
});
