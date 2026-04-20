import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Принимает buffer файла (из multer memoryStorage)
// Возвращает промис с данными загрузки (в т.ч. secure_url)
export const saveFileToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    // Создаём upload_stream — cloudinary читает данные из потока
    const uploadStream = cloudinary.uploader.upload_stream(
      // Папка в Cloudinary куда сохраняем
      { folder: 'avatars' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    // Создаём Readable стрим из буфера и направляем в uploadStream
    Readable.from(buffer).pipe(uploadStream);
  });
};