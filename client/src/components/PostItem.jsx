import { Link } from "react-router";
import { format } from "timeago.js";

const PostItem = ({ post }) => {
  return (
    <div className="h-[200px] flex flex-col gap-1">
      <Link to={`/posts/${post._id}`} className="h-3/4">
        <img
          src={post.img || "/noproduct.jpg"}
          alt=""
          className="h-full w-full rounded-xl"
        />
      </Link>
      <div className="h-1/4">
        <h1 className="text-lg font-medium">{post.title}</h1>
        <div className="flex items-center justify-between">
          <h2>{post.category}</h2>
          <span className="text-textSoft text-sm">
            {format(post.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
