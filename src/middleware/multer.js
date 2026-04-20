import multer from 'multer';
import createHttpError from 'http-errors';

// Хранимим файл в памяти (не на диске), получаем buffer
const storage = multer.memoryStorage();

export const upload = multer({
  // Указываем хранилище — память
  storage,

  // Ограничение размера файла — 2MB
  limits: { fileSize: 2 * 1024 * 1024 },

  // Фильтр файлов — пропускаем только изображения
  fileFilter: (_req, file, cb) => {
    // Проверяем mimetype — должен начинаться с 'image/'
    if (!file.mimetype.startsWith('image/')) {
      return cb(createHttpError(400, 'Only images allowed'));
    }
    
    cb(null, true);
  },
});
