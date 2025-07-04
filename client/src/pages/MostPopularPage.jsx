import Posts from "../components/Posts";
import { useSearchParams } from "react-router";

const MostPopularPage = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  return (
    <div>
      <h1 className="text-xl font-semibold text-center mb-2">
        🌟 Most Popular Posts
      </h1>
      <p className="text-center text-textSoft mb-8">
        Browse the latest and most popular posts in real-time.
      </p>
      <Posts page={page} sort="popular" />
    </div>
  );
};
export default MostPopularPage;
