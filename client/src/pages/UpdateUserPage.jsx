import { useState } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import CloudinaryUploadWidget from "../components/CloudinaryUploadWidget";
import uwConfig from "../utils/cloudinaryConfig";
import apiRequest from "../utils/apiRequest";
import { toast } from "react-toastify";
import useAuthStore from "../zustand/useAuthStore";

const UpdateUserPage = () => {
  const { currentUser, updateCurrentUser } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState(currentUser.img || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await apiRequest.put(`/users/${currentUser?._id}`, {
        username,
        email,
        password,
        img: file,
      });
      updateCurrentUser(res.data);
      toast.success("User has been updated");

      e.target.reset();
    } catch (error) {
      toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex items-center justify-center">
      <div className="border border-borderColor rounded-lg p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <h1 className="text-lg font-medium text-center">Update</h1>
          <div className="flex flex-col gap-1">
            <label htmlFor="username">Username</label>
            <input
              className="p-3 border border-borderColor rounded-md"
              type="text"
              name="username"
              id="username"
              autoFocus
              defaultValue={currentUser?.username}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <input
              className="p-3 border border-borderColor rounded-md"
              type="email"
              name="email"
              id="email"
              defaultValue={currentUser?.email}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <div className="p-3 border border-borderColor rounded-md flex items-center justify-between">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="password"
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
      </div>
    </div>
  );
};

export default UpdateUserPage;
