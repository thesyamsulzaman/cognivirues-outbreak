/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import BattleState from "@/classes/battle-state";
import { InfectedType } from "@/classes/game-objects/enemy-placement";
import {
  Direction,
  LevelThemes,
  PLACEMENT_TYPE_INFECTED_MAN,
  THEME_BATTLE_SCREENS,
} from "@/constants/helpers";
import { TILES } from "@/constants/tiles";
import { useBattleSequence, wait } from "@/hooks/use-battle-sequence";

import {
  ActionMenuDisplay,
  DialogContainer,
  DialogContentType,
  DialogType,
  TextMessageDisplay,
} from "../hud/dialog";
import HealthBar from "../hud/healthbar";
import Body from "../object-graphics/body";
import Sprite from "../object-graphics/sprite";

const RenderBattle = ({ level = null }: any) => {
  const battle = level?.battle;
  const combatanEffectsRef = useRef<HTMLDivElement>(null);
  const backgroundImage = THEME_BATTLE_SCREENS[level.theme as LevelThemes];

  // Global Battle Event
  const textMessage = battle?.textMessage;
  const submissionMenu = battle?.submissionMenu;

  const hero = battle?.combatants?.[battle?.activeCombatants["hero"]];
  const enemy = battle?.combatants?.[battle?.activeCombatants["enemy"]];

  const triggerStateChangeAnimation = useCallback((id) => {
    const combatanElement = combatanEffectsRef.current?.querySelector(`#${id}`);

    if (combatanElement) {
      combatanElement.classList.remove("animate-blink", "animate-bounceBack");
      combatanElement.classList.add("animate-bounceBack");

      setTimeout(() => {
        combatanElement.classList.remove("animate-bounceBack");
        combatanElement.classList.add("animate-blink");

        setTimeout(() => {
          combatanElement.classList.remove("animate-blink");
        }, 400);
      }, 400);
    }
  }, []);

  useEffect(() => {
    const onBattleAction = (event: Event) => {
      const customEvent = (event as CustomEvent)?.detail;

      switch (customEvent?.type) {
        case "stateChange":
          triggerStateChangeAnimation(
            customEvent?.onCaster ? "hero" : customEvent?.target?.team
          );
          break;

        case "givesXp":
          break;

        default:
          break;
      }
    };

    document.addEventListener("battle-action", onBattleAction);

    return () => {
      document.removeEventListener("battle-action", onBattleAction);
    };
  }, [triggerStateChangeAnimation]);

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-gray-500/80"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        imageRendering: "pixelated",
      }}
    >
      <div className="w-[var(--game-viewport-width)] h-[var(--game-viewport-height)] scale-[var(--pixel-size)] relative flex flex-col justify-center items-center gap-2 -mt-20">
        <div className="self-stretch flex justify-between">
          <HealthBar
            {...{
              avatarCoordinate: hero?.tile,
              name: hero?.name,
              level: hero?.level,
              hp: hero?.hp,
              status: hero?.status?.type,
              xp: hero?.xp,
            }}
          />

          <HealthBar
            {...{
              avatarCoordinate: enemy?.tile,
              name: enemy?.name,
              level: enemy?.level,
              hp: enemy?.hp,
              status: enemy?.status?.type,
              xp: enemy?.xp,
            }}
          />
        </div>
        <div
          ref={combatanEffectsRef}
          className="w-full flex justify-between block px-2"
        >
          <div id="hero">
            <Body
              frameCoordinate={hero?.tile}
              yTranslate={0}
              showShadow={true}
            />
          </div>

          <div id="enemy">
            <Body frameCoordinate={enemy?.tile} yTranslate={1} showShadow />
          </div>
        </div>
      </div>

      {hero?.isHeroControlled && !!submissionMenu && (
        <ActionMenuDisplay
          text="Select an Option"
          options={submissionMenu?.keyboardMenu?.options}
          onComplete={() => submissionMenu?.done()}
        />
      )}

      {!!textMessage && (
        <TextMessageDisplay
          onComplete={() => textMessage?.done()}
          content={[
            {
              type: DialogContentType.Message,
              skippable: true,
              text: textMessage?.text,
            },
          ]}
        />
      )}
    </div>
  );
};

export default RenderBattle;
