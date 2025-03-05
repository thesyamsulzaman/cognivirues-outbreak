import RenderLevel from "@/components/level-layout/render-level";
import GameProvider from "@/contexts/game";

const GameEditor = () => {
  return (
    <GameProvider isEditing>
      <RenderLevel />
    </GameProvider>
  );
};

export default GameEditor;
