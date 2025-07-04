import { useEffect, useRef, useState } from "react";
import { format } from "timeago.js";
import { BsThreeDotsVertical } from "react-icons/bs";
import UpdateCommentForm from "./forms/UpdateCommentForm";
import CommentInteractions from "./CommentInteractions";
import DeleteCommentModal from "./DeleteCommentModal";

const Comment = ({ comment, postId, userId }) => {
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const modalRef = useRef(null);

  // Close modal when click outside
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="flex gap-2">
      <img
        src={comment.user.img || "/noavatar.png"}
        alt=""
        className="h-12 w-12 rounded-full object-cover"
      />
      {openUpdate ? (
        <UpdateCommentForm
          comment={comment}
          postId={postId}
          setOpenUpdate={setOpenUpdate}
        />
      ) : (
        <div className="flex justify-between w-full">
          <div className="flex flex-col gap-1">
            <h1 className="text-sm">
              {comment.user.username}
              <span className="text-textSoft ml-1">
                {format(comment.createdAt)}
              </span>
            </h1>
            <p>{comment.desc}</p>
            {/*like and unlike button */}
            <CommentInteractions
              comment={comment}
              userId={userId}
              postId={postId}
            />
          </div>
          {userId === comment.user._id && (
            <div className="relative">
              <BsThreeDotsVertical
                className="cursor-pointer"
                onClick={() => setOpen((prev) => !prev)}
              />
              {open && (
                <div
                  className="absolute top-5 right-0 p-3 bg-bgSoft rounded-lg flex flex-col gap-2 z-30"
                  ref={modalRef}
                >
                  <button
                    className="p-1 hover:bg-gray-200 hover:dark:bg-gray-700 rounded-md font-medium cursor-pointer"
                    onClick={() => {
                      setOpenUpdate(true);
                      setOpen(false);
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="p-1 hover:bg-gray-200 hover:dark:bg-gray-700 rounded-md font-medium cursor-pointer"
                    onClick={() => {
                      setOpen(false);
                      setOpenDelete(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {openDelete && (
        <DeleteCommentModal
          setOpenDelete={setOpenDelete}
          id={comment._id}
          postId={postId}
        />
      )}
    </div>
  );
};

export default Comment;
