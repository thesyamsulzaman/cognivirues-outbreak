import levels from "../../levels/levels-map";
import progressEntry from "@/classes/progress-entry";
import LevelCompletedSvg from "../object-graphics/level-completed-svg";
import { useGame } from "@/contexts/game";
import { useNavigate } from "react-router-dom";

function LevelCompleteMessage() {
  const navigate = useNavigate();
  const { levelId, setLevelId } = useGame({});

  const onSendToNextLevel = () => {
    const levelKeys = Object.keys(levels);
    const currentIndex = levelKeys.findIndex((key) => key === levelId);
    const nextLevelId = levelKeys[currentIndex + 1] ?? levelKeys[0];

    progressEntry.save({
      checkpoint: nextLevelId,
      completedLevels: levelKeys.slice(0, currentIndex + 1 + 1),
    });

    if (levelKeys[currentIndex] === "level-7") {
      navigate("/");
    } else {
      setLevelId(nextLevelId as keyof typeof levels);
    }
  };

  return (
    <div className="outer-container absolute inset-0 z-[var(--ui-popup-z-index)] flex items-center justify-center">
      <div className="popup-container relative">
        <button onClick={onSendToNextLevel}>
          <LevelCompletedSvg />
        </button>
      </div>
    </div>
  );
}

export default LevelCompleteMessage;
