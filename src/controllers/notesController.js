import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 5, tag, search } = req.query;
  const skip = (page - 1) * perPage;

  let query = Note.find();

  // обязательно: только свои заметки
  query = query.where('userId').equals(req.user._id);

  // фильтр по тегу
  if (tag) {
    query = query.where('tag').equals(tag);
  }

  //  текстовый поиск
  if (search) {
    query = query.where({ $text: { $search: search } }); 
  }

  const [totalNotes, notes] = await Promise.all([
    Note.countDocuments(query.getQuery()),
    query.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes,
  });
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findOne({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found!');
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create({
    ...req.body,
    userId: req.user._id,
  });
  res.status(201).json(note);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;

 const note = await Note.findOneAndUpdate(
   {
     _id: noteId, // 🔹 noteId — это ID заметки из URL (req.params.noteId)
     userId: req.user._id, // 🔹 userId — ID текущего пользователя (из authenticate middleware)
   },
   req.body, // 🔹 данные, которые нужно обновить (title, content, tag и т.д.)
   {
     returnDocument: 'after', // 🔹 вернуть уже ОБНОВЛЁННЫЙ документ (а не старый)
   },
 );

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
