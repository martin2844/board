import { getThreads } from "@/services/thread";
import ThreadPage from "@/components/pagesContent/Thread";

const HomePage = async () => {
  const paginatedThreads = await getThreads(1, 10)
  return (
    <ThreadPage 
      threads={paginatedThreads.threads} 
      currentPage={paginatedThreads.currentPage} 
      totalPages={paginatedThreads.totalPages} 
    />
  );
};

export default HomePage;
