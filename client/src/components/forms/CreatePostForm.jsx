import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiRequest from "../../utils/apiRequest";
import { toast } from "react-toastify";
import CloudinaryUploadWidget from "../CloudinaryUploadWidget";
import uwConfig from "../../utils/cloudinaryConfig";

const CreatePostForm = ({ setOpen, page, search }) => {
  const [file, setFile] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPost) => {
      return apiRequest.post("/posts", newPost);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["posts", page, search] });
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

    const title = formData.get("title");
    const desc = formData.get("desc");
    const category = formData.get("category");
    const isFeatured = formData.get("isFeatured");

    mutation.mutate({ title, desc, category, isFeatured, img: file });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-black">
      <h1 className="text-lg font-medium text-center">Create Post</h1>
      <input
        className="p-3 border border-borderColor rounded-md"
        type="text"
        name="title"
        placeholder="title"
        ref={inputRef}
        required
      />
      <input
        className="p-3 border border-borderColor rounded-md"
        type="text"
        name="desc"
        placeholder="desc"
        required
      />
      <select
        className="p-3 border border-borderColor rounded-md"
        name="category"
        required
      >
        <option value="">Select Category</option>
        <option value="general">General</option>
        <option value="technology">Technology</option>
        <option value="health">Health</option>
        <option value="sports">Sports</option>
        <option value="education">Education</option>
      </select>
      <select
        className="p-3 border border-borderColor rounded-md"
        name="isFeatured"
      >
        <option value="false">Is Featured?</option>
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

export default CreatePostForm;
