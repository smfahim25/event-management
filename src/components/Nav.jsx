import { useEffect, useRef, useState } from "react";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CustomUserButton from "./ui/CustomUserButton";
import { useData } from "../context/DataContext";
import LanguageDropdown from "./ui/LanguageToggleButton";
import { useAuthStore } from "../store/AuthStore";

const Nav = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const navRef = useRef(null);
  const sidebarRef = useRef(null); // Add ref for sidebar
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { defaultTexts } = useData();
  const location = useLocation();
  const isProfilePage = location.pathname === "/app/profile";
  const isDashboardPage = location.pathname === "/dashboard";
  const isMyticketPage = location.pathname === "/app/my-tickets";

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".hamburger-button") // Don't close if clicking hamburger
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const getNavbarClasses = () => {
    if (isProfilePage || isDashboardPage || isMyticketPage) {
      return "bg-[#1e8489] text-white";
    }

    if (isScrolled) {
      return "bg-[#1e8489] text-white";
    } else {
      return "bg-[#1e8489] text-white";
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav
      ref={navRef}
      className={`nav w-full z-40 ${getNavbarClasses()} h-[8vh] md:h-[7vh] xl:h-[8vh] flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 fixed top-0 left-0 transition-all duration-300 ease-in-out backdrop-blur-sm shadow-lg`}
    >
      <div
        onClick={() => {
          navigate("/");
        }}
        className="logo qwigley-regular text-2xl md:text-3xl lg:text-3xl xl:text-4xl"
        style={{
          cursor: "pointer",
        }}
      >
        <h2>{defaultTexts.nav.logo}</h2>
      </div>

      {/* Backdrop Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-64 bg-black transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden z-50`}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-[#3D004D]">
          <div className="profile h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
            {user ? (
              <CustomUserButton />
            ) : (
              <a href="/login">
                <FaUserAlt className="text-gray-600" />
              </a>
            )}
          </div>

          <button
            onClick={closeMenu}
            className="text-2xl text-white hover:text-gray-300"
          >
            <RiCloseLine />
          </button>
        </div>

        {/* Menu Items Section */}
        <div className="bg-[#3D004D] py-4">
          <ul className="flex flex-col gap-6 font-semibold text-lg px-6 text-white">
            <li
              className="cursor-pointer hover:text-black transition-colors"
              onClick={() => {
                closeMenu();
                navigate("/");
              }}
            >
              {defaultTexts.nav.menuItems[0]}
            </li>

            <li
              className="cursor-pointer hover:text-black transition-colors"
              onClick={() => {
                closeMenu();
                navigate("/app/events");
              }}
            >
              {defaultTexts.nav.menuItems[1]}
            </li>

            {/* {user?.role === "user" && ( */}
            <li
              className="cursor-pointer hover:text-black transition-colors"
              onClick={() => {
                closeMenu();
                navigate("/app/profile");
              }}
            >
              {defaultTexts.nav.menuItems[3]}
            </li>
            {/* )} */}

            {user?.role === "user" && (
              <li
                className="cursor-pointer hover:text-black transition-colors"
                onClick={() => {
                  closeMenu();
                  navigate("/app/my-tickets");
                }}
              >
                My Tickets
              </li>
            )}

            <li
              className="cursor-pointer hover:text-black transition-colors"
              onClick={() => {
                closeMenu();
                navigate("/contact-us");
              }}
            >
              {defaultTexts.nav.menuItems[2]}
            </li>

            {user?.role === "organizer" && (
              <li
                className="cursor-pointer hover:text-black transition-colors"
                onClick={() => {
                  closeMenu();
                  navigate("/dashboard");
                }}
              >
                {defaultTexts.nav.menuItems[4]}
              </li>
            )}

            {user && (
              <li
                className="cursor-pointer hover:text-black transition-colors"
                onClick={() => {
                  closeMenu();
                  navigate("/app/profile");
                }}
              >
                Profile
              </li>
            )}

            {user && (
              <li
                className="cursor-pointer hover:text-red-600 transition-colors"
                onClick={() => {
                  closeMenu();
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden lg:flex justify-center gap-4 lg:gap-6 xl:gap-10 font-semibold text-lg">
        <li
          className="cursor-pointer hover:text-black transition-colors"
          onClick={() => navigate("/")}
        >
          {defaultTexts.nav.menuItems[0]}
        </li>

        <li
          className="cursor-pointer hover:text-black transition-colors"
          onClick={() => navigate("/app/events")}
        >
          {defaultTexts.nav.menuItems[1]}
        </li>

        {/* {user?.role === "user" && ( */}
        <li
          className="cursor-pointer hover:text-black transition-colors"
          onClick={() => navigate("/app/profile")}
        >
          {defaultTexts.nav.menuItems[3]}
        </li>
        {/* )} */}

        <li
          className="cursor-pointer hover:text-black transition-colors"
          onClick={() => navigate("/contact-us")}
        >
          {defaultTexts.nav.menuItems[2]}
        </li>

        {user?.role === "organizer" && (
          <li
            className="cursor-pointer hover:text-black transition-colors"
            onClick={() => navigate("/dashboard")}
          >
            {defaultTexts.nav.menuItems[4]}
          </li>
        )}
      </ul>

      <div className="flex gap-3 md:gap-4 lg:gap-5">
        <div>
          <LanguageDropdown />
        </div>

        {/* Hamburger Icon for Mobile */}
        <button
          className={`hamburger-button sm:block lg:hidden text-3xl ${
            isProfilePage || isDashboardPage || isScrolled
              ? "text-white"
              : "text-white"
          } hover:text-gray-300 transition-colors`}
          onClick={toggleMenu}
        >
          {!isMenuOpen && <RiMenu3Line />}
        </button>

        {/* Profile Icon for Desktop */}
        <div
          className={`profile border-2 border-gray-600 h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 rounded-full ${
            isProfilePage || isDashboardPage || isScrolled
              ? "bg-white/20"
              : "bg-gray-100"
          } hidden lg:flex items-center justify-center`}
        >
          {user ? (
            <CustomUserButton />
          ) : (
            <Link to="/login">
              <FaUserAlt
                className={`${
                  isProfilePage || isDashboardPage || isScrolled
                    ? "text-gray-600"
                    : "text-gray-600"
                }`}
              />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
