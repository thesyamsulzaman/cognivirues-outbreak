// @ts-nocheck
import { TILES } from "@/constants/tiles";
import Body from "../../components/object-graphics/body";
import {
  BODY_SKINS,
  Direction,
  HERO_RUN_1,
  HERO_RUN_2,
  PLACEMENT_TYPE_GROUND_ENEMY,
  Z_INDEX_LAYER_SIZE,
} from "@/constants/helpers";
import { BodyPlacement } from "./body-placement";
import soundManager, { SFX } from "../sounds";
import { HeroState } from "../hero-state";
import { noop } from "lodash";

const heroSkinMap = {
  [BODY_SKINS.NORMAL]: [TILES.HERO_LEFT, TILES.HERO_RIGHT],
  [BODY_SKINS.WATER]: [TILES.HERO_WATER_LEFT, TILES.HERO_WATER_RIGHT],
  [BODY_SKINS.FIRE]: [TILES.HERO_FIRE_LEFT, TILES.HERO_FIRE_RIGHT],
  [BODY_SKINS.DEATH]: [TILES.HERO_DEATH_LEFT, TILES.HERO_DEATH_RIGHT],
  // [BODY_SKINS.CONVEYOR]: [TILES.HERO_CONVEYOR_LEFT, TILES.HERO_CONVEYOR_RIGHT],
  [BODY_SKINS.CONVEYOR]: [TILES.HERO_DEATH_LEFT, TILES.HERO_DEATH_RIGHT],
  [BODY_SKINS.SCARED]: [TILES.HERO_DEATH_LEFT, TILES.HERO_DEATH_RIGHT],
  [BODY_SKINS.ICE]: [TILES.HERO_ICE_LEFT, TILES.HERO_ICE_RIGHT],
  [BODY_SKINS.TELEPORT]: [TILES.HERO_TELEPORT_LEFT, TILES.HERO_TELEPORT_RIGHT],
  [HERO_RUN_1]: [TILES.HERO_RUN_1_LEFT, TILES.HERO_RUN_1_RIGHT],
  [HERO_RUN_2]: [TILES.HERO_RUN_3_LEFT, TILES.HERO_RUN_3_RIGHT],
};

class HeroPlacement extends BodyPlacement {
  canCollectItem: boolean;
  canCompleteLevel: boolean;
  interactWithGround: boolean;
  canStartBattle: boolean;
  painFramesRemaining: number;
  state: HeroState;
  canTriggerDialog: boolean;

  constructor(properties, level) {
    super(properties, level);
    this.canCollectItem = true;
    this.canStartBattle = true;
    this.canCompleteLevel = true;
    this.canTriggerDialog = true;
    this.interactWithGround = true;
    this.painFramesRemaining = 0;

    this.state = new HeroState();
  }

  damagesBodyOnCollide(_body: any): any {
    if (_body.type === PLACEMENT_TYPE_GROUND_ENEMY) {
      return this.type;
    }

    return null;
  }

  async controllerMoveRequested(direction: Direction) {
    if (this.movingPixelsRemaining > 0) {
      return;
    }

    /**
     * Custscenes
     */
    const dialog = this.getDialogAtPosition(direction);

    if (dialog?.cutscene) {
      this.level
        .startCutScene(dialog?.cutscene)
        .then(() => {
          this.level.deleteDialog({ x: dialog?.x, y: dialog?.y });
        })
        .catch(noop);
    }

    /**
     * Start Battle Scene
     */
    const faceToFaceEnemy = this.getInfectedAtNextPosition(direction);
    if (faceToFaceEnemy) {
      const intro = faceToFaceEnemy.state.intro;

      this.level.startCutScene([
        ...intro,
        {
          type: "battle",
          enemy: faceToFaceEnemy,
        },
      ]);
    }

    /**
     * Making sure the next place is unlockable object
     */
    const possibleLock = this.getLockAtNextPosition(direction);
    if (possibleLock) {
      possibleLock.unlock();
    }

    /**
     * Making sure the next place is not solid object
     */
    if (this.isSolidAtNextPosition(direction)) {
      return;
    }

    this.movingPixelsRemaining = 16;
    this.movingPixelDirection = direction;
    this.updateFacingDirection();
    this.updateWalkFrame();
  }

  onAutoMovement(_direction: Direction): any {
    this.controllerMoveRequested(_direction);
  }

  initiatePainFrames() {
    const PAIN_FRAMES_LENGTH = 16;
    this.painFramesRemaining = PAIN_FRAMES_LENGTH;
  }

  takesDamage(type: string): null {
    this.state.update({
      hp: this.state.hp - 15 <= 0 ? 0 : this.state.hp - 15,
    });
    soundManager.playSFX(SFX.DAMAGE);

    if (this.state.hp <= 0) {
      this.level.setDeathOutcome(type);
    }
  }

  getFrame() {
    const index = this.spriteFacingDirection === Direction.Left ? 0 : 1;

    if (this.painFramesRemaining > 0) {
      return heroSkinMap[BODY_SKINS.DEATH][index];
    }

    if (this.level.deathOutcome) {
      return heroSkinMap[BODY_SKINS.DEATH][index];
    }

    if (this.movingPixelsRemaining > 0 && this.skin === BODY_SKINS.NORMAL) {
      const walkKey = this.spriteWalkFrame === 0 ? HERO_RUN_1 : HERO_RUN_2;
      return heroSkinMap[walkKey][index];
    }

    return heroSkinMap[this.skin][index];
  }

  zIndex() {
    return this.y * Z_INDEX_LAYER_SIZE + 1;
  }

  canBeDeleted() {
    return false;
  }

  renderComponent() {
    const shouldShowShadow = this.skin !== BODY_SKINS.WATER;

    return (
      <Body frameCoordinate={this.getFrame()} showShadow={shouldShowShadow} />
    );
  }
}

export default HeroPlacement;
