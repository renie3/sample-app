import { useEffect, useRef, useState } from "react";
import useAuthStore from "../zustand/useAuthStore";
import { Link, useNavigate } from "react-router";
import apiRequest from "../utils/apiRequest";
import { toast } from "react-toastify";

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const navigate = useNavigate();
  const { currentUser, removeCurrentUser } = useAuthStore();

  const handleLogout = async () => {
    setLoading(true);

    try {
      const res = await apiRequest.post("/auth/logout");
      removeCurrentUser();
      toast.success(res.data);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <div className="cursor-pointer" onClick={() => setOpen((prev) => !prev)}>
        <img
          className="h-8 w-8 object-cover rounded-full"
          src={currentUser.img || "/noavatar.png"}
          alt=""
        />
      </div>
      {open && (
        <div className="absolute top-9 -right-8 md:right-0 w-65 p-5 bg-bgSoft rounded-xl flex flex-col items-center gap-1">
          <img
            className="h-12 w-12 object-cover rounded-full"
            src={currentUser.img || "/noavatar.png"}
            alt=""
          />
          <div className="flex flex-col items-center">
            <h1>{currentUser.username}</h1>
            <h1>{currentUser.email}</h1>
          </div>
          <div className="w-full flex items-center gap-3 mt-1 text-white">
            <Link
              to="/update-user"
              className="flex-1 p-1 bg-green-700 rounded-md font-medium text-center"
              onClick={() => setOpen(false)}
            >
              Update
            </Link>
            <button
              className="flex-1 p-1 bg-green-700 rounded-md font-medium cursor-pointer disabled:cursor-not-allowed"
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? <div className="spinner" /> : "Logout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
