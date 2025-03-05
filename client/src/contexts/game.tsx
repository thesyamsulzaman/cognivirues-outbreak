/* eslint-disable react-refresh/only-export-components */
import soundManager from "@/classes/sounds";
import { SPRITESHEET_IMAGE_SRC } from "@/constants/helpers";
import levels from "@/levels/levels-map";
import { noop } from "lodash";
import React, { createContext, useContext, useEffect, useState } from "react";

interface SpriteSheetImage {
  isEditing?: boolean;
  image: HTMLImageElement | null;
  levelId: keyof typeof levels;
  setLevelId: (levelId: keyof typeof levels) => void;
}

soundManager.init();

type GameProviderProps = { isEditing?: boolean; children: React.ReactNode };

export const GameContext = createContext<SpriteSheetImage>({
  image: null,
  levelId: "level-editor",
  setLevelId: noop,
});

// const checkpoint = progressEntry.get().checkpoint as keyof typeof levels;
const checkpoint = null;

const GameProvider: React.FC<GameProviderProps> = ({
  isEditing = false,
  children,
}) => {
  const [levelId, setLevelId] = useState<keyof typeof levels>(
    checkpoint || "level-1"
    // "level-e"
  );

  const [spriteSheetImage, setSpriteSheetImage] =
    useState<HTMLImageElement | null>(null);

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
      value={{ image: spriteSheetImage, levelId, setLevelId, isEditing }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within an ProfileProvider");
  }
  return context;
};

export default GameProvider;
