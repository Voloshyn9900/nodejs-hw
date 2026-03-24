import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message || err.name,
    });
  }

  const isProd = process.env.NODE_ENV === 'production';

  res.status(500).json({
    message: isProd
      ? 'Something went wrong 500 :)'
      : {
          message: 'Something went wrong 500 :)',
          error: err.message,
          stack: err.stack,
        },
  });
};

// (err, req, res, next) => {
//   const isProd = process.env.NODE_ENV === 'production';

//   res.status(500).json({
//     status: 500,
//     message: 'Something went wrong.',
//     ...(isProd
//       ? {}
//       : {
//           error: err.message,
//           stack: err.stack,
//         }),
//   });
// };
