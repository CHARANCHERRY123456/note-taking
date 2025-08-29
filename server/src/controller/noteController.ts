import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  createNoteService,
  getUserNotesService,
  getNoteByIdService,
  updateNoteService,
  deleteNoteService,
} from "../services/noteService";

/**
 * POST /api/notes
 * Body: { title, content }
 */
export async function createNote(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { title, content } = req.body;
    const userId = req.user!.id;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const note = await createNoteService(userId, title, content);
    return res.status(201).json(note);
  } catch (err) {
    console.error("createNote error:", err);
    next(err);
  }
}

/**
 * GET /api/notes
 */
export async function getUserNotes(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const notes = await getUserNotesService(userId);
    return res.json(notes);
  } catch (err) {
    console.error("getUserNotes error:", err);
    next(err);
  }
}

/**
 * GET /api/notes/:id
 */
export async function getNoteById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const note = await getNoteByIdService(id, userId);
    return res.json(note);
  } catch (err) {
    console.error("getNoteById error:", err);
    next(err);
  }
}

/**
 * PUT /api/notes/:id
 * Body: { title, content }
 */
export async function updateNote(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user!.id;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const note = await updateNoteService(id, userId, title, content);
    return res.json(note);
  } catch (err) {
    console.error("updateNote error:", err);
    next(err);
  }
}

/**
 * DELETE /api/notes/:id
 */
export async function deleteNote(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const result = await deleteNoteService(id, userId);
    return res.json(result);
  } catch (err) {
    console.error("deleteNote error:", err);
    next(err);
  }
}
