import { useQuery } from "@tanstack/react-query";
import apiRequest from "../utils/apiRequest";
import { format } from "timeago.js";
import FormModal from "../components/FormModal";
import AdminSearch from "../components/AdminSearch";
import { useSearchParams } from "react-router";
import AdminPagination from "../components/AdminPagination";

const AdminPostsPage = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  const { isPending, error, data } = useQuery({
    queryKey: ["posts", page, search],
    queryFn: () =>
      apiRequest(`/posts?page=${page}&search=${search}`).then((res) => {
        return res.data;
      }),
  });

  return (
    <div className="bg-bgSoft p-5 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <AdminSearch />
        <FormModal table="post" type="create" page={page} search={search} />
      </div>
      {isPending ? (
        <div className="spinner" />
      ) : error ? (
        "Something went wrong"
      ) : (
        <>
          <table className="w-full border-separate border-spacing-3">
            <thead>
              <tr className="text-left">
                <th>Title</th>
                <th className="hidden xl:table-cell">Description</th>
                <th className="hidden lg:table-cell">Category</th>
                <th className="hidden lg:table-cell">Featured</th>
                <th className="hidden md:table-cell">Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.posts.map((post) => (
                <tr key={post._id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <img
                        src={post.img || "/noproduct.jpg"}
                        alt=""
                        className="h-10 w-10 object-cover rounded-full"
                      />
                      {post.title}
                    </div>
                  </td>
                  <td className="hidden xl:table-cell">{post.desc}</td>
                  <td className="hidden lg:table-cell">{post.category}</td>
                  <td className="hidden lg:table-cell">
                    {post.isFeatured ? "true" : "false"}
                  </td>
                  <td className="hidden md:table-cell">
                    {format(post.createdAt)}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <FormModal
                        table="post"
                        type="update"
                        data={post}
                        page={page}
                        search={search}
                      />
                      <FormModal
                        table="post"
                        type="delete"
                        id={post._id}
                        page={page}
                        search={search}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <AdminPagination totalData={data.totalPosts} />
        </>
      )}
    </div>
  );
};

export default AdminPostsPage;
