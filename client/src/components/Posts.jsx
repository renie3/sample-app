import { useQuery } from "@tanstack/react-query";
import PostItem from "./PostItem";
import apiRequest from "../utils/apiRequest";
import Pagination from "./Pagination";

const Posts = ({ page, category, q, sort }) => {
  const { isPending, error, data } = useQuery({
    queryKey: ["posts", page, category, q, sort],
    queryFn: () =>
      apiRequest
        .get(
          `/posts?page=${page}&category=${category || ""}&q=${q || ""}&sort=${
            sort || ""
          }`
        )
        .then((res) => res.data),
  });

  if (isPending) return <div className="spinner" />;
  if (error) return "Something went wrong";

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {data.posts.map((post) => (
          <PostItem key={post._id} post={post} />
        ))}
      </div>
      <Pagination totalData={data?.totalPosts || 0} isLoading={isPending} />
    </>
  );
};

export default Posts;
