import { useEffect, useRef, useState } from "react";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import CustomUserButton from "./ui/CustomUserButton";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useData } from "../context/DataContext";
import LanguageDropdown from "./ui/LanguageToggleButton";

gsap.registerPlugin(ScrollTrigger);

const Nav = () => {
  const isSignedIn = false;
  const navigate = useNavigate();
  const navRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { defaultTexts, isOrganizer } = useData();
  const location = useLocation();
  const isProfilePage = location.pathname === "/app/profile";

  useEffect(() => {
    if (isProfilePage && navRef.current) {
      gsap.to(navRef.current, {
        backgroundColor: "rgb(0,0,0,0.7)",
        duration: 0.6,
      });
      return;
    }

    const scrollTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: "100vh -100vh",
      onEnter: () =>
        gsap.to(navRef.current, {
          backgroundColor: "rgb(0,0,0,0.7)",
          duration: 0.6,
        }),
      onLeaveBack: () =>
        gsap.to(navRef.current, {
          backgroundColor: "rgba(0,0,0,0.1)",
          duration: 0.6,
        }),
    });

    // Cleanup function
    return () => {
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
    };
  }, [isProfilePage]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      ref={navRef}
      className={`nav w-full z-40 text-white ${
        isProfilePage ? "bg-black" : "bg-black/30"
      } h-[8vh] flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 fixed top-0 left-0`}
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

      {/* Overlay for Dark Background when Menu is Open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleMenu} // close menu when clicking outside the sidebar
        ></div>
      )}

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#0c0311] text-white transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden z-50`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          {/* Profile Icon */}
          <div className="profile h-10 w-10 rounded-full bg-black/40 flex items-center justify-center">
            {isSignedIn ? <CustomUserButton /> : <FaUserAlt />}
          </div>

          {/* Close Icon */}
          <button onClick={toggleMenu} className="text-2xl text-white">
            <RiCloseLine />
          </button>
        </div>

        {/* Menu Items for mobo*/}
        <ul className="flex flex-col gap-6 font-semibold text-lg px-6 mt-8 ">
          <li
            className="cursor-pointer"
            onClick={() => {
              setIsMenuOpen(false);
              navigate("/");
            }}
          >
            {defaultTexts.nav.menuItems[0]}
          </li>
          <li
            className="cursor-pointer"
            onClick={() => {
              setIsMenuOpen(false);
              navigate("/app/events");
            }}
          >
            {defaultTexts.nav.menuItems[1]}
          </li>

          {!isOrganizer && (
            <>
              <li
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate("/app/profile");
                }}
              >
                {defaultTexts.nav.menuItems[3]}
              </li>
            </>
          )}

          <li
            className="cursor-pointer"
            onClick={() => {
              setIsMenuOpen(false);
              navigate("/contact-us");
            }}
          >
            {defaultTexts.nav.menuItems[2]}
          </li>
        </ul>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden lg:flex gap-4 lg:gap-6 xl:gap-10 font-semibold text-lg md:ml-8 lg:ml-16 xl:ml-36">
        <li
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            navigate("/");
          }}
        >
          {defaultTexts.nav.menuItems[0]}
        </li>
        <li
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            navigate("/app/events");
          }}
        >
          {defaultTexts.nav.menuItems[1]}
        </li>

        {!isOrganizer && (
          <>
            <li
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                navigate("/app/profile");
              }}
            >
              {defaultTexts.nav.menuItems[3]}
            </li>
          </>
        )}

        <li
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            navigate("/contact-us");
          }}
        >
          {defaultTexts.nav.menuItems[2]}
        </li>
      </ul>

      <div className="flex gap-3 md:gap-4 lg:gap-5">
        <div className="">
          <LanguageDropdown />
        </div>

        {/* Hamburger Icon for Mobile */}
        <button
          className="sm:block lg:hidden text-white text-3xl"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <RiCloseLine /> : <RiMenu3Line />}
        </button>
        {/* Profile Icon for Desktop */}
        <div className="profile h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 rounded-full bg-black/40 hidden lg:flex items-center justify-center">
          {isSignedIn ? (
            <CustomUserButton />
          ) : (
            <a href="/login">
              <FaUserAlt />
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
