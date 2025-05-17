import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/AuthStore";
import { User } from "phosphor-react";
import { LuLogOut } from "react-icons/lu";

function CustomUserButton() {
  const pfp = "https://placehold.co/100x100";
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const { logout, user } = useAuthStore();

  const handleProfileRedirect = () => {
    navigate("/app/profile");
    setIsOpen(false);
  };

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setIsOpen(false);
    }, 300);
    setTimeoutId(id);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="pfp h-10 w-10 rounded-full overflow-hidden border-2 border-indigo-500 transition-all duration-200 hover:scale-105 cursor-pointer shadow-md">
        <img src={pfp} alt="Profile" className="h-full w-full object-cover" />
      </div>

      <div
        className={`absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10 transform origin-top-right transition-all duration-200 ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* User info section */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user?.name || "Guest User"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {user?.email || "guest@example.com"}
          </p>
        </div>

        {/* Menu options */}
        <div className="py-1">
          <button
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors duration-150"
            onClick={handleProfileRedirect}
          >
            <User size={16} className="mr-2 text-indigo-500" />
            <span>Profile</span>
          </button>
          <button
            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
            onClick={handleSignOut}
          >
            <LuLogOut size={16} className="mr-2" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomUserButton;
