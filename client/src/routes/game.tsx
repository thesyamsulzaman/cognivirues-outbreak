"use client";
import RenderLevel from "@/components/level-layout/render-level";
import GameProvider from "@/contexts/game";

const Game = () => {
  return (
    <GameProvider>
      <RenderLevel />
    </GameProvider>
  );
};

export default Game;
