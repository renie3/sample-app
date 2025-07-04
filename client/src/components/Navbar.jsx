import { Link, NavLink } from "react-router";
import useAuthStore from "../zustand/useAuthStore";
import Search from "./Search";
import UserMenu from "./UserMenu";
import DarkModeToggle from "./DarkModeToggle";
import MobileMenu from "./MobileMenu";
import { links } from "../constants";

const Navbar = () => {
  const { currentUser } = useAuthStore();

  return (
    <div className="h-20 flex justify-between items-center">
      <Link to="/" className="hidden lg:inline text-lg font-medium">
        Blog App
      </Link>
      <Search />
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2">
          {links.map((link) => (
            <NavLink
              key={link.title}
              to={link.path}
              className={({ isActive }) =>
                `py-1 px-3 rounded-full text-lg font-medium ${
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
              className={({ isActive }) =>
                `py-1 px-3 rounded-full text-lg font-medium ${
                  isActive
                    ? "bg-blue-500 dark:bg-white text-white dark:text-black"
                    : ""
                }`
              }
            >
              Dashboard
            </NavLink>
          )}
        </div>
        <DarkModeToggle />
        {currentUser ? (
          <UserMenu />
        ) : (
          <Link
            to="/login"
            className="hidden md:inline py-1 px-2 rounded-md font-medium bg-blue-500 dark:bg-white text-white dark:text-black"
          >
            Login
          </Link>
        )}
        {/* MOBILE MENU */}
        <MobileMenu currentUser={currentUser} />
      </div>
    </div>
  );
};

export default Navbar;
