import FlourCount from "./flour-count";
import LevelCompleteMessage from "./level-complete-message";
import DeathMessage from "./death-message";
import InventoryList from "./inventory-list";
import HealthBar from "./healthbar";
import { useGame } from "@/contexts/game";
import GameEditor from "./game-editor";
import JournalsManagement from "./journals-management";
import Sprite from "../object-graphics/sprite";
import { TILES } from "@/constants/tiles";

const TopHud = ({ level, isEditing }: { level: any; isEditing: boolean }) => {
  return (
    <div className="absolute inset-x-0 top-[4px] flex justify-between items-start">
      <div className="flex gap-[8px] origin-top-left scale-[var(--pixel-size)] items-center">
        <HealthBar
          {...{
            avatarCoordinate: TILES.HERO_RIGHT,
            name: level?.heroRef?.state?.name,
            level: level?.heroRef?.state?.level,
            hp: level?.heroRef?.state?.hp,
            xp: level?.heroRef?.state?.xp,
          }}
        />

        <button
          className="scale-[1]"
          onClick={() => level.manageJournalsScreen.open()}
        >
          <Sprite frameCoordinate={TILES.MAP_BUTTON} size={16} />
        </button>
      </div>

      {!isEditing && (
        <div className="flex gap-[4px] origin-top-right items-center m-4">
          <InventoryList level={level} />
        </div>
      )}

      {isEditing && (
        <div className="flex gap-[4px] origin-top-right">
          <GameEditor level={level} />
        </div>
      )}
    </div>
  );
};

export default TopHud;
