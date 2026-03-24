import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { connectMongoDB } from './db/connectMongoDB.js';

const app = express();
const PORT = process.env.PORT || 3000;

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:HH:MM:ss',
      ignore: 'pid,hostname',
    },
  },
});

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(
  pinoHttp({
    logger,
    // один финальный лог
    customSuccessMessage: (req, res) =>
      `${req.method} ${req.url} ${res.statusCode}`,
    customErrorMessage: (req, res) =>
      `${req.method} ${req.url} ${res.statusCode}`,

    // добавляем поля к логу
    customProps: (req, res) => ({
      params: req.params,
      query: req.query,
      responseTime: res.responseTime,
    }),

    // отключаем большие блоки req/res
    serializers: {
      req() {
        return undefined;
      },
      res() {
        return undefined;
      },
    },
  }),
);

//notes
app.get('/notes', (req, res) => {
  res.status(200).json({
    message: 'Retrieved all notes',
  });
});

//notes/:noteId
app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;

  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

//test-error
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// error middleware
app.use((err, req, res, next) => {
  const isProd = process.env.NODE_ENV === 'production';

  res.status(500).json({
    status: 500,
    message: 'Something went wrong.',
    ...(isProd
      ? {}
      : {
          error: err.message,
          stack: err.stack,
        }),
  });
});

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
