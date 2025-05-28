import LoadingMessage from "@/components/hud/loading-message";
import RenderGame from "@/components/level-layout/render-game";
import useGetJournals from "@/hooks/queries/use-get-journals";
import { isToday } from "@/utils/common";
import { useMemo } from "react";

const Game = () => {
  const { data: journals, isLoading } = useGetJournals();

  const hasTodayJournal = useMemo(() => {
    return journals?.some((journal) => isToday(journal.createdAt));
  }, [journals]);

  if (isLoading) {
    return <LoadingMessage />;
  }

  if (!hasTodayJournal) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-cyan-300 text-center px-4">
        <div className="bg-white border border-black rounded-md p-8 shadow-lg max-w-md w-full">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-500">
            Access Denied
          </h1>
          <p className="text-lg mb-6 text-gray-600">
            You need to write a journal entry today to start the game. please go
            back to menu
          </p>
          <a
            href="/"
            className="text-center flex justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded transition duration-150"
            title="Return to menu"
          >
            Back to menu
          </a>
        </div>
      </div>
    );
  }

  return <RenderGame />;
};

export default Game;
