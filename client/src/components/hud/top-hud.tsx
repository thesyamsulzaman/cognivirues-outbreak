import FlourCount from "./flour-count";
import LevelCompleteMessage from "./level-complete-message";
import DeathMessage from "./death-message";
import InventoryList from "./inventory-list";
import HealthBar from "./healthbar";
import { useGame } from "@/contexts/game";
import GameEditor from "./game-editor";

const TopHud = ({ level }: { level: any }) => {
  const { isEditing } = useGame();
  const healthRemaining = level?.heroRef?.stats?.health;

  return (
    <div className="absolute inset-x-0 top-[4px] flex justify-between items-start">
      <div className="flex gap-[4px] origin-top-left scale-[var(--pixel-size)] items-center">
        <HealthBar hp={healthRemaining} />
        <FlourCount level={level} />
        <InventoryList level={level} />
      </div>
      <div className="flex gap-[4px] origin-top-right">
        {isEditing && <GameEditor level={level} />}
      </div>
    </div>
  );
};

export default TopHud;
