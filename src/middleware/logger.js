import pino from 'pino';
import pinoHttp from 'pino-http';

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

export const httpLogger = () => pinoHttp({
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
});
