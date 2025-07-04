import { useQuery } from "@tanstack/react-query";
import apiRequest from "../utils/apiRequest";
import { Link } from "react-router";
import { format } from "timeago.js";

const FeaturedPosts = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["featuredPosts"],
    queryFn: () => apiRequest.get(`/posts/featured`).then((res) => res.data),
  });

  if (isPending) return <div className="spinner" />;
  if (error) return "Something went wrong";

  return (
    <div>
      <h1 className="text-lg font-medium mb-5">Featured Posts</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {data.map((post) => (
          <div key={post._id} className="h-[300px] flex flex-col gap-1">
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
        ))}
      </div>
    </div>
  );
};
export default FeaturedPosts;
