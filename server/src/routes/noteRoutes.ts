import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import {
  createNote,
  getUserNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controller/noteController";

const noteRouter = Router();

// All note routes require authentication
noteRouter.use(authenticateToken);

// CRUD operations
noteRouter.post("/", createNote);           // Create note
noteRouter.get("/", getUserNotes);          // Get all user notes
noteRouter.get("/:id", getNoteById);        // Get single note
noteRouter.put("/:id", updateNote);         // Update note
noteRouter.delete("/:id", deleteNote);      // Delete note

export default noteRouter;
