import { useNavigate } from "react-router-dom";
import { clearToken } from "../utils/auth";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Note Taker</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to Note Taker!</h2>
          <p className="text-gray-600 mb-6">
            You have successfully logged in. Start creating and managing your notes.
          </p>
          
          <div className="space-y-4">
            <button className="w-full sm:w-auto bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600">
              Create New Note
            </button>
            <div className="text-sm text-gray-500">
              More features coming soon...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
