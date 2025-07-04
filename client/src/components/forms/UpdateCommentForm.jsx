import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiRequest from "../../utils/apiRequest";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";

const UpdateCommentForm = ({ comment, postId, setOpenUpdate }) => {
  const [desc, setDesc] = useState(comment.desc);
  const [openEmoji, setOpenEmoji] = useState(false);
  const inputRef = useRef(null);
  const emojiRef = useRef(null);

  const handleEmojiClick = (e) => {
    setDesc((prev) => prev + e.emoji);
    inputRef.current?.focus();
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    if (!openEmoji) return;

    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setOpenEmoji(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openEmoji]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updatedComment) => {
      return apiRequest.put(`/comments/${comment._id}`, updatedComment);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setOpenUpdate(false);
      setOpenEmoji(false);
      toast.success(res.data);
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ desc });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
      <input
        className="text-sm border-b border-borderColor w-full pb-1"
        type="text"
        ref={inputRef}
        onChange={(e) => setDesc(e.target.value)}
        value={desc}
      />
      <div className="flex items-center justify-between">
        {/* emoji */}
        <div className="relative" ref={emojiRef}>
          <div
            className="cursor-pointer text-xl"
            onClick={() => setOpenEmoji((prev) => !prev)}
          >
            😊
          </div>
          {openEmoji && (
            <div className="absolute left-0 bottom-16">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            className="w-16 h-8 bg-gray-500 dark:bg-gray-700 text-white rounded-md cursor-pointer"
            type="button"
            onClick={() => setOpenUpdate(false)}
          >
            Cancel
          </button>
          <button
            className="w-16 h-8 bg-blue-500 dark:bg-blue-700 text-white rounded-md cursor-pointer disabled:cursor-not-allowed"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? <div className="spinner" /> : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default UpdateCommentForm;
