// import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const notes = await Note.find();
  res.status(200).json(notes);
};

export const getNoteByIdController = async (req, res) => {};

export const createNoteController = async (req, res) => {};

export const deleteNoteController = async (req, res) => {};

export const updateNoteController = async (req, res) => {};
