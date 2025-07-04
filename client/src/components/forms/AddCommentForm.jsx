import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiRequest from "../../utils/apiRequest";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";

const AddCommentForm = ({ postId }) => {
  const [desc, setDesc] = useState("");
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
    mutationFn: (newComment) => {
      return apiRequest.post(`/comments/${postId}`, newComment);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setDesc("");
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
    <form onSubmit={handleSubmit} className="w-full">
      <input
        className="text-sm border-b border-borderColor w-full pb-1"
        type="text"
        placeholder="Add a comment..."
        required
        onChange={(e) => setDesc(e.target.value)}
        value={desc}
        ref={inputRef}
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
        <button
          className="w-16 h-8 bg-blue-500 dark:bg-blue-700 text-white rounded-md mt-2 cursor-pointer disabled:cursor-not-allowed"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <div className="spinner" /> : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default AddCommentForm;
