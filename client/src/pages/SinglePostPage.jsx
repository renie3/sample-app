import { useQuery } from "@tanstack/react-query";
import apiRequest from "../utils/apiRequest";
import { useParams } from "react-router";
import { format } from "timeago.js";
import RelatedPosts from "../components/RelatedPosts";
import Comments from "../components/Comments";
import { useEffect } from "react";

const SinglePostPage = () => {
  const { id } = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["post", id],
    queryFn: () =>
      apiRequest.get(`/posts/${id}`).then((res) => {
        return res.data;
      }),
  });

  useEffect(() => {
    if (id && data) {
      apiRequest.patch(`/posts/visit/${id}`);
    }
  }, [id, data]);

  if (isPending) return <div className="spinner" />;
  if (error) return "Something went wrong";

  return (
    <div>
      <div className="flex gap-5 h-[530px]">
        <div className="w-1/2">
          <img
            src={data.img || "/noproduct.jpg"}
            alt=""
            className="w-full h-full rounded-xl"
          />
        </div>
        <div className="w-1/2 flex flex-col justify-between pl-5">
          <div>
            <h1 className="text-2xl font-semibold">{data.title}</h1>
            <h2 className="my-2 text-xl font-medium">{data.category}</h2>
            <p className="my-5">{data.desc}</p>
            <span className="text-textSoft text-sm">
              {format(data.createdAt)}
            </span>
          </div>
          <div>
            <h1 className="mb-5">Author</h1>
            <div className="flex items-center gap-2">
              <img
                src={data.user.img || "/noavatar.png"}
                alt=""
                className="h-10 w-10 rounded-full object-cover"
              />
              {data.user.username}
            </div>
          </div>
        </div>
      </div>
      <hr className="my-5 border-gray-300 dark:border-gray-800" />
      <RelatedPosts category={data.category} postId={id} />
      <hr className="my-5 border-gray-300 dark:border-gray-800" />
      <Comments postId={id} />
    </div>
  );
};

export default SinglePostPage;
