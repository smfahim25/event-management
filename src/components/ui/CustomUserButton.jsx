import { useNavigate } from "react-router-dom";
import { useState } from "react";

function CustomUserButton() {
  const pfp = "https://placehold.co/100x100";
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleProfileRedirect = () => {
    navigate("/app/profile");
    setIsOpen(false);
  };

  const handleSignOut = () => {
    navigate("/");
  };

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setIsOpen(false);
    }, 200);
    setTimeoutId(id);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="pfp h-10 w-10 rounded-full bg-black/40 overflow-hidden flex items-center justify-center">
        <img src={pfp} alt="Profile" />
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={handleProfileRedirect}
          >
            Go to Profile
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default CustomUserButton;
