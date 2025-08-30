import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearToken } from "../utils/auth";
import axiosClient from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../context/ToastContext";
import { validateNoteTitle, validateNoteContent } from "../utils/validation";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  name: string;
  email: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [creating, setCreating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchUserData();
    fetchNotes();
  }, []);

  const fetchUserData = async () => {
    try {
      console.log(user);
      const response = await axiosClient.get("/auth/me");
      setUser(response.data);
    } catch (error: any) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await axiosClient.get("/notes");
      setNotes(response.data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to fetch notes";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const validateNoteForm = () => {
    const newErrors: Record<string, string> = {};
    
    const titleError = validateNoteTitle(newNote.title);
    if (titleError) newErrors[titleError.field] = titleError.message;
    
    const contentError = validateNoteContent(newNote.content);
    if (contentError) newErrors[contentError.field] = contentError.message;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateNote = async () => {
    if (!validateNoteForm()) {
      showToast("Please fix the errors below", "error");
      return;
    }

    setCreating(true);
    try {
      await axiosClient.post("/notes", newNote);
      setNewNote({ title: "", content: "" });
      setShowCreateForm(false);
      setErrors({});
      showToast("Note created successfully!", "success");
      fetchNotes(); // Refresh notes
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to create note";
      showToast(errorMessage, "error");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteNote = async (noteId: string, noteTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${noteTitle}"?`)) return;

    try {
      await axiosClient.delete(`/notes/${noteId}`);
      showToast("Note deleted successfully!", "success");
      fetchNotes(); // Refresh notes
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to delete note";
      showToast(errorMessage, "error");
    }
  };

  const handleLogout = () => {
    clearToken();
    showToast("Logged out successfully", "info");
    navigate("/signin");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Note Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors"
          >
            {showCreateForm ? "Cancel" : "Create New Note"}
          </button>
        </div>

        {/* Create Note Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Create New Note</h3>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Note title..."
                  value={newNote.title}
                  onChange={(e) => {
                    setNewNote({ ...newNote, title: e.target.value });
                    if (errors.title) setErrors(prev => ({ ...prev, title: "" }));
                  }}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <textarea
                  placeholder="Note content..."
                  value={newNote.content}
                  onChange={(e) => {
                    setNewNote({ ...newNote, content: e.target.value });
                    if (errors.content) setErrors(prev => ({ ...prev, content: "" }));
                  }}
                  rows={4}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.content ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCreateNote}
                  disabled={creating}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50 flex items-center gap-2 transition-colors"
                >
                  {creating && <LoadingSpinner size="small" color="white" />}
                  {creating ? "Saving..." : "Save Note"}
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewNote({ title: "", content: "" });
                    setErrors({});
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notes List */}
        {notes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No notes yet</h3>
            <p className="text-gray-500 mb-4">Create your first note to get started!</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Create your first note
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <div key={note._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">
                    {note.title}
                  </h3>
                  <button
                    onClick={() => handleDeleteNote(note._id, note.title)}
                    className="text-red-500 hover:text-red-700 text-xl transition-colors"
                    title="Delete note"
                  >
                    🗑️
                  </button>
                </div>
                <p className="text-gray-600 mb-3 line-clamp-3">
                  {note.content}
                </p>
                <div className="text-sm text-gray-400">
                  Created: {formatDate(note.createdAt)}
                  {note.updatedAt !== note.createdAt && (
                    <div>Updated: {formatDate(note.updatedAt)}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
