import React, { useState, useRef, useEffect, Suspense } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiRequest from "../utils/apiRequest";
import { toast } from "react-toastify";
// import CreatePostForm from "./forms/CreatePostForm";
// import UpdatePostForm from "./forms/UpdatePostForm";
// import CreateUserForm from "./forms/CreateUserForm";
// import UpdateUserForm from "./forms/UpdateUserForm";

const CreatePostForm = React.lazy(() => import("./forms/CreatePostForm"));
const UpdatePostForm = React.lazy(() => import("./forms/UpdatePostForm"));
const CreateUserForm = React.lazy(() => import("./forms/CreateUserForm"));
const UpdateUserForm = React.lazy(() => import("./forms/UpdateUserForm"));

const FormModal = ({ table, type, data, id, page, search }) => {
  const [open, setOpen] = useState(false);
  const modalRef = useRef(null);

  // Close form when click outside or esc
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return apiRequest.delete(`/${table}s/${id}`);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [`${table}s`, page, search] });
      setOpen(false);
      toast.success(res.data);
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const Form = () => {
    if (type === "delete" && id) {
      return (
        <>
          <span className="text-center font-medium text-black mt-3 mb-1">
            Are you sure you want to delete this {table}?
          </span>
          <div className="self-center flex gap-3">
            <button
              className="w-16 h-8 bg-red-500 dark:bg-red-700 text-white rounded-md cursor-pointer disabled:cursor-not-allowed"
              disabled={mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? <div className="spinner" /> : "Delete"}
            </button>
            <button
              className="w-16 h-8 bg-gray-500 dark:bg-gray-700 text-white rounded-md cursor-pointer"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </>
      );
    }

    if (type === "create" && table === "post")
      return <CreatePostForm setOpen={setOpen} page={page} search={search} />;
    if (type === "update" && table === "post")
      return (
        <UpdatePostForm
          setOpen={setOpen}
          post={data}
          page={page}
          search={search}
        />
      );

    if (type === "create" && table === "user")
      return <CreateUserForm setOpen={setOpen} page={page} search={search} />;
    if (type === "update" && table === "user")
      return (
        <UpdateUserForm
          setOpen={setOpen}
          user={data}
          page={page}
          search={search}
        />
      );

    return null;
  };

  return (
    <>
      <button
        className={`py-1 px-2 rounded-md cursor-pointer capitalize ${
          type === "create"
            ? "bg-blue-500 dark:bg-blue-700 text-white"
            : type === "update"
            ? "bg-green-500 dark:bg-green-700 text-white"
            : "bg-red-500 dark:bg-red-700 text-white"
        }`}
        onClick={() => setOpen(true)}
      >
        {type}
      </button>
      {open && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center">
          <div
            className="bg-white rounded-lg p-5 flex flex-col gap-2 relative"
            ref={modalRef}
          >
            <button
              className="text-black cursor-pointer absolute top-2 right-3"
              onClick={() => setOpen(false)}
            >
              X
            </button>
            <Suspense fallback={<div className="text-black">Loading...</div>}>
              <Form />
            </Suspense>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
