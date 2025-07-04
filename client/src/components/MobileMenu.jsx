import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";
import { links } from "../constants";

const MobileMenu = ({ currentUser }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when click outside
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="md:hidden flex items-center" ref={menuRef}>
      {/* MOBILE BUTTON */}
      <button
        className="cursor-pointer text-4xl"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="flex flex-col gap-[5.4px]">
          <div
            className={`h-[3px] rounded-md w-6 bg-text origin-left transition-all ease-in-out ${
              open && "rotate-45"
            }`}
          ></div>
          <div
            className={`h-[3px] rounded-md w-6 bg-text transition-all ease-in-out ${
              open && "opacity-0"
            }`}
          ></div>
          <div
            className={`h-[3px] rounded-md w-6 bg-text origin-left transition-all ease-in-out ${
              open && "-rotate-45"
            }`}
          ></div>
        </div>
      </button>
      {/* MOBILE LINK LIST */}
      <div
        className={`fixed top-20 right-0 h-screen w-1/2 bg-bgSoft rounded-l-2xl flex flex-col items-center gap-2 p-5 transition-all ease-in-out z-40 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {links.map((link) => (
          <NavLink
            key={link.title}
            to={link.path}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `w-full p-3 text-center font-medium text-lg rounded-md hover:bg-blue-500 hover:text-white dark:hover:bg-white dark:hover:text-black ${
                isActive
                  ? "bg-blue-500 dark:bg-white text-white dark:text-black"
                  : ""
              }`
            }
          >
            {link.title}
          </NavLink>
        ))}
        {currentUser?.isAdmin && (
          <NavLink
            to="/admin"
            end
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `w-full p-3 text-center font-medium text-lg rounded-md hover:bg-blue-500 hover:text-white dark:hover:bg-white dark:hover:text-black ${
                isActive
                  ? "bg-blue-500 dark:bg-white text-white dark:text-black"
                  : ""
              }`
            }
          >
            Dashboard
          </NavLink>
        )}
        {!currentUser && (
          <NavLink
            to="/login"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `w-full p-3 text-center font-medium text-lg rounded-md hover:text-white dark:hover:bg-white dark:hover:text-black ${
                isActive
                  ? "bg-blue-500 dark:bg-white text-white dark:text-black"
                  : ""
              }`
            }
          >
            Login
          </NavLink>
        )}
      </div>
    </div>
  );
};
export default MobileMenu;
