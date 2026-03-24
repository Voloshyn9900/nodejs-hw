import { Router } from 'express';
import {
  getAllNotes,
  getNoteByIdController,
  createNoteController,
  deleteNoteController,
  updateNoteController,
} from '../controllers/notesController.js';

const router = Router();

router.get('/notes', getAllNotes);
router.get('/notes/:noteId', getNoteByIdController);
router.post('/notes', createNoteController);
router.delete('/notes/:noteId', deleteNoteController);
router.patch('/notes/:noteId', updateNoteController);

export default router;
