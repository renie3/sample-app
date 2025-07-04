import { FaSearch } from "react-icons/fa";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useDebouncedCallback } from "use-debounce";

const AdminSearch = ({ placeholder }) => {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleSearch = useDebouncedCallback((e) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", "1");

    if (e.target.value) {
      params.set("search", e.target.value);
    } else {
      params.delete("search");
    }
    navigate(`${pathname}?${params.toString()}`, { replace: true });
  }, 300);

  return (
    <div className="border border-borderColor p-1 flex items-center justify-between rounded-2xl">
      <div className="px-2 dark:text-gray-400">
        <FaSearch />
      </div>
      <input
        className="w-full bg-transparent"
        type="text"
        placeholder={placeholder}
        onChange={handleSearch}
        defaultValue={searchParams.get("search")?.toString()}
      />
    </div>
  );
};

export default AdminSearch;
