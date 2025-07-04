import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import apiRequest from "../../utils/apiRequest";
import { toast } from "react-toastify";
import CloudinaryUploadWidget from "../CloudinaryUploadWidget";
import uwConfig from "../../utils/cloudinaryConfig";

const UpdateUserForm = ({ setOpen, user, page, search }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState(user.img || "");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updatedUser) => {
      return apiRequest.put(`/users/${user._id}`, updatedUser);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["users", page, search] });
      setOpen(false);
      toast.success("User has been updated");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const isAdmin = formData.get("isAdmin");

    mutation.mutate({ username, email, password, isAdmin, img: file });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-black">
      <h1 className="text-lg font-medium text-center">Update User</h1>
      <div className="flex flex-col gap-1">
        <label htmlFor="username">Username</label>
        <input
          className="p-3 border border-borderColor rounded-md"
          type="text"
          name="username"
          id="username"
          ref={inputRef}
          defaultValue={user.username}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="email">Email</label>
        <input
          className="p-3 border border-borderColor rounded-md"
          type="email"
          name="email"
          id="email"
          defaultValue={user.email}
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
            className="cursor-pointer"
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
      <div>
        <label htmlFor="isAdmin">Admin</label>
        <select
          className="ml-2 p-2 border border-borderColor rounded-md"
          name="isAdmin"
          id="isAdmin"
          defaultValue={user.isAdmin ? "true" : "false"}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
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
        disabled={mutation.isPending}
      >
        {mutation.isPending ? <div className="spinner" /> : "Submit"}
      </button>
    </form>
  );
};

export default UpdateUserForm;
