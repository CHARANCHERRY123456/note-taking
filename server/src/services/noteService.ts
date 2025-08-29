import { Note, INote } from "../models/Note";

export async function createNoteService(userId: string, title: string, content: string) {
  const note = await Note.create({
    title,
    content,
    userId,
  });
  return note;
}

export async function getUserNotesService(userId: string) {
  const notes = await Note.find({ userId }).sort({ updatedAt: -1 });
  return notes;
}

export async function getNoteByIdService(noteId: string, userId: string) {
  const note = await Note.findOne({ _id: noteId, userId });
  if (!note) {
    throw new Error("Note not found");
  }
  return note;
}

export async function updateNoteService(noteId: string, userId: string, title: string, content: string) {
  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId },
    { title, content },
    { new: true }
  );
  if (!note) {
    throw new Error("Note not found");
  }
  return note;
}

export async function deleteNoteService(noteId: string, userId: string) {
  const note = await Note.findOneAndDelete({ _id: noteId, userId });
  if (!note) {
    throw new Error("Note not found");
  }
  return { message: "Note deleted successfully" };
}
