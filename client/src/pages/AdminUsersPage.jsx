import { useQuery } from "@tanstack/react-query";
import apiRequest from "../utils/apiRequest";
import { format } from "timeago.js";
import FormModal from "../components/FormModal";
import AdminSearch from "../components/AdminSearch";
import { useSearchParams } from "react-router";
import AdminPagination from "../components/AdminPagination";

const AdminUsersPage = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  const { isPending, error, data } = useQuery({
    queryKey: ["users", page, search],
    queryFn: () =>
      apiRequest(`/users?page=${page}&search=${search}`).then((res) => {
        return res.data;
      }),
  });

  return (
    <div className="bg-bgSoft p-5 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <AdminSearch />
        <FormModal table="user" type="create" page={page} search={search} />
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
                <th>Username</th>
                <th className="hidden xl:table-cell">Email</th>
                <th className="hidden lg:table-cell">Admin</th>
                <th className="hidden md:table-cell">Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <img
                        src={user.img || "/noavatar.png"}
                        alt=""
                        className="h-10 w-10 object-cover rounded-full"
                      />
                      {user.username}
                    </div>
                  </td>
                  <td className="hidden xl:table-cell">{user.email}</td>
                  <td className="hidden lg:table-cell">
                    {user.isAdmin ? "true" : "false"}
                  </td>
                  <td className="hidden md:table-cell">
                    {format(user.createdAt)}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <FormModal
                        table="user"
                        type="update"
                        data={user}
                        page={page}
                        search={search}
                      />
                      <FormModal
                        table="user"
                        type="delete"
                        id={user._id}
                        page={page}
                        search={search}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <AdminPagination totalData={data.totalUsers} />
        </>
      )}
    </div>
  );
};

export default AdminUsersPage;
