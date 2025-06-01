import { getThreads } from "@/services/thread";
import ThreadPage from "@/components/pagesContent/Thread";

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

const HomePage = async ({ searchParams }: HomePageProps) => {
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1', 10);
  const paginatedThreads = await getThreads(currentPage, 10);

  return (
    <ThreadPage
      threads={paginatedThreads.threads}
      currentPage={paginatedThreads.currentPage}
      totalPages={paginatedThreads.totalPages}
    />
  );
};

export default HomePage;
