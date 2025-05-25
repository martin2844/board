import { getThreads } from "@/services/thread";
import ThreadPage from "@/components/pagesContent/Thread";

const HomePage = async () => {
  const threads = await getThreads(1, 10)
  return (
    <ThreadPage threads={threads.threads} currentPage={1} totalPages={threads.totalPages} />
  );
};

export default HomePage;
