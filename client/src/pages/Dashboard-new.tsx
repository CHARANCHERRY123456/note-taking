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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xs">HD</span>
              </div>
              <span className="text-gray-800 font-semibold">Dashboard</span>
            </div>
            
            {/* User Actions */}
            <button
              onClick={handleLogout}
              className="text-blue-500 text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-white px-4 py-6 border-b">
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          Welcome, {user?.name || 'Jonas Khairwald'} !
        </h1>
        <p className="text-gray-500 text-sm">
          Email: {user?.email || 'jonas.khairwald@gmail.com'}
        </p>
        
        {/* Create Note Button */}
        <button
          onClick={() => setShowCreateForm(true)}
          className="w-full mt-4 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          Create Note
        </button>
      </div>

      {/* Notes Section */}
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
        
        {notes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No notes yet. Create your first note!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note._id}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900 truncate flex-1">
                    {note.title}
                  </h3>
                  <button
                    onClick={() => handleDeleteNote(note._id, note.title)}
                    className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                  {note.content}
                </p>
                <p className="text-xs text-gray-400">
                  {formatDate(note.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Note Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New Note</h3>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewNote({ title: "", content: "" });
                  setErrors({});
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Note title"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                  value={newNote.title}
                  onChange={(e) => {
                    setNewNote({ ...newNote, title: e.target.value });
                    if (errors.title) setErrors(prev => ({ ...prev, title: "" }));
                  }}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <textarea
                  placeholder="Write your note content here..."
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32 ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
                  value={newNote.content}
                  onChange={(e) => {
                    setNewNote({ ...newNote, content: e.target.value });
                    if (errors.content) setErrors(prev => ({ ...prev, content: "" }));
                  }}
                />
                {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewNote({ title: "", content: "" });
                    setErrors({});
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNote}
                  disabled={creating}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                >
                  {creating && <LoadingSpinner size="small" color="white" />}
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
