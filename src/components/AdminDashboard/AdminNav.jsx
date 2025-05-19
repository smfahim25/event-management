import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../../store/AuthStore";
import { useNavigate } from "react-router-dom";

export default function Navbar({
  mobileMenuOpen,
  setMobileMenuOpen,
  pendingApprovals,
  dateRange,
  setDateRange,
}) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuthStore();
  const navogate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navogate("/");
  };

  const totalNotifications =
    pendingApprovals.organizers +
    pendingApprovals.events +
    pendingApprovals.refunds;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">
                Admin Dashboard
              </h1>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                  <option value="year">This Year</option>
                  <option value="all">All Time</option>
                </select>
              </div>
              <div className="ml-3 relative">
                <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span className="sr-only">View notifications</span>
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {totalNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {totalNotifications}
                      </span>
                    )}
                  </div>
                </button>
              </div>
              <div className="ml-3 relative" ref={dropdownRef}>
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className={`flex items-center transition-all duration-200 ${
                      userDropdownOpen
                        ? "bg-gray-100 shadow-md border border-gray-200"
                        : "bg-gray-100 shadow-md border border-gray-100"
                    } rounded-lg p-1`}
                  >
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt="Admin profile"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                      {user?.name || "Admin"}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 ml-1 text-gray-500 transition-transform duration-200 ${
                        userDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
                {userDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <a
                      href="/app/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </a>
                    <a
                      href="#"
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
