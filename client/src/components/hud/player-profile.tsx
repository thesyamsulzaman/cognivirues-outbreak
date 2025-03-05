import { useGame } from "@/contexts/game";

function PlayerProfile() {
  const { levelId, setLevelId } = useGame();

  return (
    <div className="outer-container absolute inset-0 z-[var(--ui-popup-z-index)] flex items-center justify-center">
      <div className="popup-container relative"></div>
    </div>
  );
}

export default PlayerProfile;
