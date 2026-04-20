import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const updateUserAvatar = async (req, res) => {
  // Проверяем есть ли файл в запросе (кладёт туда multer)
  if (!req.file) {
    throw createHttpError(400, 'No file');
  }

  // Загружаем буфер файла в Cloudinary
  const result = await saveFileToCloudinary(req.file.buffer);

  // Обновляем поле avatar у текущего пользователя в базе
  await User.updateOne({ _id: req.user._id }, { avatar: result.secure_url });

  // Возвращаем ссылку на новый аватар
  return res.status(200).json({ url: result.secure_url });
};
