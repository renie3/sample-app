import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { BiDislike, BiSolidDislike } from "react-icons/bi";
import apiRequest from "../utils/apiRequest";
import { toast } from "react-toastify";

const CommentInteractions = ({ comment, userId, postId }) => {
  const queryClient = useQueryClient();

  // like mutation
  const likeMutation = useMutation({
    mutationFn: () => {
      return apiRequest.patch(`/comments/like/${comment._id}`);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success(res.data);
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const handleLike = () => {
    if (!userId) {
      toast.error("You are not authenticated");
      return;
    }

    likeMutation.mutate();
  };

  // dislike mutation
  const dislikeMutation = useMutation({
    mutationFn: () => {
      return apiRequest.patch(`/comments/dislike/${comment._id}`);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success(res.data);
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const handleDislike = () => {
    if (!userId) {
      toast.error("You are not authenticated");
      return;
    }

    dislikeMutation.mutate();
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-0.5 mb-1 w-7.5">
        <button
          className="cursor-pointer disabled:opacity-50"
          disabled={likeMutation.isPending}
          onClick={handleLike}
        >
          {comment.likes.includes(userId) ? (
            <AiFillLike size={20} />
          ) : (
            <AiOutlineLike size={20} />
          )}
        </button>
        {comment.likesCount > 0 && (
          <span className="text-sm text-textSoft">{comment.likesCount}</span>
        )}
      </div>
      <div className="flex items-center gap-0.5 mb-1 w-7.5">
        <button
          className="cursor-pointer disabled:opacity-50"
          disabled={dislikeMutation.isPending}
          onClick={handleDislike}
        >
          {comment.dislikes.includes(userId) ? (
            <BiSolidDislike size={20} />
          ) : (
            <BiDislike size={20} />
          )}
        </button>
        {comment.dislikesCount > 0 && (
          <span className="text-sm text-textSoft">{comment.dislikesCount}</span>
        )}
      </div>
    </div>
  );
};
export default CommentInteractions;
