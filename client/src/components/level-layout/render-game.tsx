import { GameDialogs } from "@/constants/content";
import { LevelThemes, THEME_BACKGROUNDS } from "@/constants/helpers";
import { TILES } from "@/constants/tiles";
import { useGame } from "@/contexts/game";
import useGetJournals from "@/hooks/queries/use-get-journals";
import { useEffect, useState } from "react";
import LevelState, { EditMode } from "../../classes/level-state";
import DeathMessage from "../hud/death-message";
import { DialogContentType, TextMessageDisplay } from "../hud/dialog";
import JournalsManagement from "../hud/journals-management";
import LevelCompleteMessage from "../hud/level-complete-message";
import LoadingMessage from "../hud/loading-message";
import TopHud from "../hud/top-hud";
import Sprite from "../object-graphics/sprite";
import LevelBackgroundTilesLayer from "./level-backround-tiles-layer";
import RenderBattle from "./render-battle-v2";

const RenderGame = ({ isEditing = false }) => {
  const [level, setLevel] = useState<any>(null);
  const { levelId, levelEnemies } = useGame({ isEditing });
  const { data: journals, isLoading, isSuccess } = useGetJournals();

  useEffect(() => {
    if (isSuccess) {
      const levelState = new LevelState({
        levelId,
        journals,
        enemies: levelEnemies[levelId],
        dialogs: GameDialogs[levelId],
        editMode: isEditing ? EditMode.PLACEMENT : EditMode.NONE,
        onEmit: (newState) => setLevel(newState),
      });
      setLevel(levelState.getState());

      const handleKeyDown = (event) => {};
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        levelState.destroy();
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [levelEnemies, isEditing, isSuccess, journals, levelId]);

  if (!level) {
    return null;
  }

  return (
    <div
      className="flex items-center justify-center inset-0 absolute"
      style={{ background: THEME_BACKGROUNDS[level.theme as LevelThemes] }}
    >
      <div className="w-[var(--game-viewport-width)] h-[var(--game-viewport-height)] scale-[var(--pixel-size)]">
        <div
          style={{
            transform: `translate3d(${level?.cameraTransformX}, ${level?.cameraTransformY}, 0)`,
          }}
        >
          <LevelBackgroundTilesLayer level={level} />

          {level?.placements
            ?.filter((placement: any) => !placement.hasBeenCollected)
            ?.map((placement: any) => {
              const [x, y] = placement.displayXY();

              return (
                <div
                  key={placement?.id}
                  style={{
                    position: "absolute",
                    transform: `translate3d(${x + "px"}, ${y + "px"}, 0)`,
                    zIndex: placement.zIndex(),
                  }}
                  onClick={() => {
                    if (
                      level.editMode === EditMode.NONE ||
                      !placement?.canBeDeleted()
                    ) {
                      return;
                    }

                    level.deletePlacement(placement);
                  }}
                >
                  {placement?.renderComponent()}
                </div>
              );
            })}
        </div>

        {level.isCompleted && <LevelCompleteMessage />}
        {level.deathOutcome && <DeathMessage level={level} />}
        {level.manageJournalsScreen.isOpen && (
          <JournalsManagement level={level} />
        )}
      </div>

      <TopHud level={level} isEditing={isEditing} />

      {!!level?.textMessage && (
        <TextMessageDisplay
          leftSection={
            level?.textMessage?.withNarrator && (
              <div className="scale-[10] w-1/5">
                <Sprite
                  frameCoordinate={TILES.HERO_RIGHT}
                  size={32}
                  className="w-[50px] ml-[43%]"
                />
              </div>
            )
          }
          onComplete={() => level?.textMessage?.done()}
          content={[
            {
              type: DialogContentType.Message,
              skippable: true,
              text: level?.textMessage?.text,
            },
          ]}
        />
      )}

      {level?.battle?.screen?.isOpen && <RenderBattle level={level} />}

      {isLoading && <LoadingMessage />}
    </div>
  );
};

export default RenderGame;
