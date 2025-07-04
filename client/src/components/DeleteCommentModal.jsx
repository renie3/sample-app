import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import apiRequest from "../utils/apiRequest";
import { toast } from "react-toastify";

const DeleteCommentModal = ({ setOpenDelete, id, postId }) => {
  const modalRef = useRef(null);

  // Close form when click outside or esc
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setOpenDelete(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setOpenDelete(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [setOpenDelete]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return apiRequest.delete(`/comments/${id}`);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setOpenDelete(false);
      toast.success(res.data);
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  return (
    <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center">
      <div
        className="bg-white rounded-lg p-5 flex flex-col gap-2 relative"
        ref={modalRef}
      >
        <button
          className="text-black cursor-pointer absolute top-2 right-3"
          onClick={() => setOpenDelete(false)}
        >
          X
        </button>
        <span className="text-center font-medium text-black mt-3 mb-1">
          Are you sure you want to delete this comment?
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
            onClick={() => setOpenDelete(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeleteCommentModal;
