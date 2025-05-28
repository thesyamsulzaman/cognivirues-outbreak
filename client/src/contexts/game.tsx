/* eslint-disable react-refresh/only-export-components */
import { ProgressEntry } from "@/classes/progress-entry";
import soundManager from "@/classes/sounds";
import { GameEnemies } from "@/constants/content";
import { SPRITESHEET_IMAGE_SRC } from "@/constants/helpers";
import usePersistedState from "@/hooks/use-persisted-state";
import levels from "@/levels/levels-map";
import { noop } from "lodash";
import React, { createContext, useContext, useEffect, useState } from "react";

interface GameContext {
  isEditing?: boolean;
  image: HTMLImageElement | null;
  levelId: keyof typeof levels;
  setLevelId: (levelId: keyof typeof levels) => void;
  levelEnemies: any;
  setLevelEnemies: (params: any) => void;
  progressEntry: ProgressEntry | null;
}

soundManager.init();

type GameProviderProps = {
  profile: any;
  children: React.ReactNode;
};

export const GameContext = createContext<GameContext>({
  image: null,
  levelId: "level-1",
  setLevelId: noop,
  levelEnemies: {},
  setLevelEnemies: noop,
  progressEntry: null,
});

const GameProvider: React.FC<GameProviderProps> = ({ profile, children }) => {
  const [spriteSheetImage, setSpriteSheetImage] =
    useState<HTMLImageElement | null>(null);

  const progressEntry = new ProgressEntry({ prefix: profile?.username });

  const [levelId, setLevelId] = useState<keyof typeof levels>(
    progressEntry.get("checkpoint") as keyof typeof levels
  );

  const [levelEnemies, setLevelEnemies] = usePersistedState(
    `${profile?.username}-Enemies`,
    GameEnemies
  );

  useEffect(() => {
    const image = new Image();
    image.src = SPRITESHEET_IMAGE_SRC;
    image.onload = () => setSpriteSheetImage(image);

    // Cleanup function to avoid memory leaks
    return () => {
      image.onload = null;
    };
  }, []);

  if (!spriteSheetImage) {
    return null;
  }

  return (
    <GameContext.Provider
      value={{
        image: spriteSheetImage,
        levelId,
        levelEnemies,
        setLevelId,
        setLevelEnemies,
        progressEntry,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = ({ isEditing = false }) => {
  const context = useContext(GameContext);

  if (context === undefined) {
    throw new Error("useProfile must be used within an ProfileProvider");
  }

  return isEditing
    ? { isEditing, ...context, levelId: "level-editor" as keyof typeof levels }
    : context;
};

export default GameProvider;
