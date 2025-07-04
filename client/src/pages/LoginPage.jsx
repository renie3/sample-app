import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { toast } from "react-toastify";
import apiRequest from "../utils/apiRequest";
import useAuthStore from "../zustand/useAuthStore";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setCurrentUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/login", {
        username,
        password,
      });
      setCurrentUser(res.data);
      if (res.data?.isAdmin) {
        toast.success(`Welcome Admin ${res.data.username}!`);
        navigate("/admin");
      } else {
        toast.success(`Welcome ${res.data.username}!`);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex items-center justify-center">
      <div className="border border-borderColor rounded-lg p-5 flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <h1 className="text-lg font-medium text-center">Login</h1>
          <input
            className="p-3 border border-borderColor rounded-md"
            type="text"
            name="username"
            placeholder="username"
            autoFocus
            required
          />
          <div className="p-3 border border-borderColor rounded-md flex items-center justify-between">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="password"
              required
            />
            <span
              className="cursor-pointer dark:text-textSoft"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <MdOutlineVisibility size={20} />
              ) : (
                <MdOutlineVisibilityOff size={20} />
              )}
            </span>
          </div>
          <button
            className="p-3 bg-blue-500 dark:bg-blue-700 text-white rounded-md cursor-pointer disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? <div className="spinner" /> : "Submit"}
          </button>
        </form>
        <Link to="/register" className="text-sm text-red-500 underline mt-2">
          Go to Register
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
