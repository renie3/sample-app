import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { toast } from "react-toastify";
import apiRequest from "../utils/apiRequest";
import CloudinaryUploadWidget from "../components/CloudinaryUploadWidget";
import uwConfig from "../utils/cloudinaryConfig";
import useAuthStore from "../zustand/useAuthStore";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);

  const { setCurrentUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/register", {
        username,
        email,
        password,
        img: file,
      });
      setCurrentUser(res.data);
      toast.success(`Welcome ${res.data.username}!`);
      navigate("/");
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
          <h1 className="text-lg font-medium text-center">Register</h1>
          <input
            className="p-3 border border-borderColor rounded-md"
            type="text"
            name="username"
            placeholder="username"
            autoFocus
            required
          />
          <input
            className="p-3 border border-borderColor rounded-md"
            type="email"
            name="email"
            placeholder="email"
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
          <div className="flex flex-col">
            {file && (
              <img
                src={file}
                alt=""
                className="h-12 w-12 object-cover rounded-full mb-1 self-center"
              />
            )}
            <CloudinaryUploadWidget uwConfig={uwConfig} setState={setFile} />
          </div>
          <button
            className="p-3 bg-blue-500 dark:bg-blue-700 text-white rounded-md cursor-pointer disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? <div className="spinner" /> : "Submit"}
          </button>
        </form>
        <Link to="/login" className="text-sm text-red-500 underline mt-2">
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
