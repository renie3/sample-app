import { useState, useRef, useEffect } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiRequest from "../../utils/apiRequest";
import { toast } from "react-toastify";
import CloudinaryUploadWidget from "../CloudinaryUploadWidget";
import uwConfig from "../../utils/cloudinaryConfig";

const CreateUserForm = ({ setOpen, page, search }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newUser) => {
      return apiRequest.post("/users", newUser);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["users", page, search] });
      setFile("");
      setOpen(false);
      toast.success(res.data);
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
      <h1 className="text-lg font-medium text-center">Create User</h1>
      <input
        className="p-3 border border-borderColor rounded-md"
        type="text"
        name="username"
        placeholder="username"
        ref={inputRef}
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
      <select
        className="p-3 border border-borderColor rounded-md"
        name="isAdmin"
      >
        <option value="false">Is Admin?</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
      <div className="flex flex-col">
        {file && (
          <img
            src={file}
            alt=""
            className="h-12 w-12 object-cover rounded-full mb-1 self-center"
          />
        )}
        <CloudinaryUploadWidget
          uwConfig={uwConfig}
          setState={setFile}
          multiple
        />
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

export default CreateUserForm;
