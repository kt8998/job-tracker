import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="text-lg font-bold text-blue-600">Job Tracker</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden sm:inline">
            {user?.name || user?.email}
          </span>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-gray-800 font-medium"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
