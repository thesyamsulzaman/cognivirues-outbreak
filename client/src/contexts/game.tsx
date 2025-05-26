/* eslint-disable react-refresh/only-export-components */
import { InfectedType } from "@/classes/game-objects/infected-placement";
import { infectedState } from "@/classes/game-objects/infected-state";
import soundManager from "@/classes/sounds";
import { GameEnemies } from "@/constants/content";
import {
  Direction,
  PLACEMENT_TYPE_INFECTED,
  SPRITESHEET_IMAGE_SRC,
} from "@/constants/helpers";
import usePersistedState from "@/hooks/use-persisted-state";
import levels from "@/levels/levels-map";
import { noop } from "lodash";
import React, { createContext, useContext, useEffect, useState } from "react";
import Enemies from "@/data/enemies.json";
import {
  ActionBuilder,
  ActionOptionBuilder,
  CharacterBuilder,
} from "@/classes/character-state-builder";
import { TILES } from "@/constants/tiles";
import progressEntry from "@/classes/progress-entry";

interface GameContext {
  isEditing?: boolean;
  image: HTMLImageElement | null;
  levelId: keyof typeof levels;
  setLevelId: (levelId: keyof typeof levels) => void;
  levelEnemies: any;
  setLevelEnemies: (params: any) => void;
}

const checkpoint = progressEntry.get().checkpoint as keyof typeof levels;

soundManager.init();

type GameProviderProps = { isEditing?: boolean; children: React.ReactNode };

export const GameContext = createContext<GameContext>({
  image: null,
  levelId: checkpoint,
  setLevelId: noop,
  levelEnemies: {},
  setLevelEnemies: noop,
});

const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [spriteSheetImage, setSpriteSheetImage] =
    useState<HTMLImageElement | null>(null);
  const [levelId, setLevelId] = useState<keyof typeof levels>(checkpoint);
  const [levelEnemies, setLevelEnemies] = usePersistedState(
    "Enemies",
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
