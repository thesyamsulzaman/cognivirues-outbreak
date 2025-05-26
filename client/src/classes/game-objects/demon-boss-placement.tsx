import {
  CELL_SIZE,
  PLACEMENT_TYPE_DEMON_BOSS,
  PLACEMENT_TYPE_ROAMING_ENEMY,
} from "@/constants/helpers";
import { GroundEnemyPlacement } from "./ground-enemy-placement";
import CiabattaBody from "@/components/object-graphics/ciabatta-body";
import { JSX } from "react";

export const Attacks = {
  Tackle: "TACKLE",
  Spawn: "SPAWN",
};

const PAIN_FRAMES_LENGTH = 20;
const DEATH_FRAMES_LENGTH = 140;

export class DemonBossPlacement extends GroundEnemyPlacement {
  tickBetweenMovesInterval: number;
  ticksUntilNextMove: number;
  turnAroundAtWater: boolean;
  interactWithGround: boolean;
  normalMovesRemaining: number;
  hp: number;
  painFramesRemaining: number;
  currentAttack: any | null;
  deathFramesUntilDissapear: number;

  constructor(properties: any, level: any) {
    super(properties, level);
    this.tickBetweenMovesInterval = 40;
    this.ticksUntilNextMove = this.tickBetweenMovesInterval;
    this.turnAroundAtWater = true;
    this.interactWithGround = true;

    this.normalMovesRemaining = 4;
    this.hp = 3;
    this.painFramesRemaining = 0;

    this.currentAttack = null;
    this.deathFramesUntilDissapear = 0;
  }

  tickAttemptAiMove(): void {
    // check if it has hit the hero
    this.checkOverlapWithHero();

    // counters
    if (this.deathFramesUntilDissapear > 0) {
      this.deathFramesUntilDissapear -= 1;

      if (this.deathFramesUntilDissapear === 0) {
        this.level.deletePlacement(this);
      }

      return;
    }

    if (this.painFramesRemaining > 0) {
      this.painFramesRemaining -= 1;
      return;
    }

    if (this.ticksUntilNextMove > 0) {
      this.ticksUntilNextMove -= 1;
      return;
    }

    // attack type
    if (this.currentAttack) {
      this.workOnAttackFrame();
      return;
    }

    // turn on a walls
    const direction = this.movingPixelDirection;
    if (this.isSolidAtNextPosition(direction)) {
      this.switchDirection();
      return;
    }

    // if next spot is free then walk in there
    if (this.movingPixelsRemaining === 0) {
      this.ticksUntilNextMove = this.tickBetweenMovesInterval;
      this.movingPixelsRemaining = CELL_SIZE;
      this.movingPixelDirection = direction;
      this.updateFacingDirection();
      this.updateWalkFrame();
    }
  }

  onPostMove(): null | void {
    // launch new attack
    if (this.normalMovesRemaining === 0) {
      this.normalMovesRemaining = 4;
      this.startAttack();
      return;
    }

    // keep moving
    this.normalMovesRemaining -= 1;
  }

  takesDamage(): any {
    this.painFramesRemaining = PAIN_FRAMES_LENGTH;
    this.hp -= 1;

    if (this.hp <= 0) {
      // Counting down death frame
      this.deathFramesUntilDissapear = DEATH_FRAMES_LENGTH;
    }
  }

  startAttack(): void {
    const possibleAttack = [Attacks.Tackle, Attacks.Spawn];

    const next =
      possibleAttack[Math.floor(Math.random() * possibleAttack.length)];

    if (next === Attacks.Tackle) {
      this.currentAttack = {
        type: Attacks.Tackle,
        framesRemaining: 120,
        returnToY: this.y,
      };
    }

    if (next === Attacks.Spawn) {
      this.currentAttack = {
        type: Attacks.Spawn,
        framesRemaining: 210,
      };
    }
  }

  workOnAttackFrame(): void {
    if (this.currentAttack.framesRemaining === 0) {
      this.currentAttack = null;
      return;
    }

    if (this.currentAttack.type === Attacks.Tackle) {
      this.handleTackleAttackFrame();
    }

    if (this.currentAttack.type === Attacks.Spawn) {
      this.handleSpawnAttackFrame();
    }

    this.currentAttack.framesRemaining -= 1;
  }

  handleSpawnAttackFrame() {
    const { framesRemaining } = this.currentAttack;

    if (framesRemaining === 210) {
      [
        // {
        //   type: PLACEMENT_TYPE_ROAMING_ENEMY,
        //   x: this.level.heroRef.x,
        //   y: this.level.heroRef.y + 2,
        // },
        // {
        //   type: PLACEMENT_TYPE_ROAMING_ENEMY,
        //   x: this.level.heroRef.x + 2,
        //   y: this.level.heroRef.y,
        // },
        {
          type: PLACEMENT_TYPE_ROAMING_ENEMY,
          x: this.level.heroRef.x - 2,
          y: this.level.heroRef.y,
        },
      ]
        // Remove placements that are out of bounds
        .filter(
          (placement) =>
            placement.x > 0 &&
            placement.x <= this.level.tilesWidth &&
            placement.y < this.level.tilesHeight
        )
        .forEach((enemyConfig) => {
          // add to level
          this.level.addPlacement(enemyConfig);
        });
    }

    if (framesRemaining === 1) {
      this.level.placements.forEach((placement) => {
        if (placement.type === PLACEMENT_TYPE_ROAMING_ENEMY) {
          this.level.deletePlacement(placement);
        }
      });
    }
  }

  handleTackleAttackFrame() {
    const { framesRemaining, returnToY } = this.currentAttack;

    // Teleport above hero direction
    if (framesRemaining === 119) {
      this.x = this.level.heroRef.x;
      this.y = this.level.heroRef.y - 1;

      if (this.y < 1) {
        this.y = 1;
      }
    }

    // Lunge at the hero
    if (framesRemaining === 90) {
      this.y = this.y + 1;
    }

    // Return to previous row
    if (framesRemaining === 50) {
      this.y = returnToY;
    }
  }

  getFrame() {
    const frame = this?.level?.animatedFrames?.getFrame(
      PLACEMENT_TYPE_DEMON_BOSS,
      this.spriteFacingDirection
    );

    return frame;
  }

  renderComponent(): JSX.Element | null {
    return <CiabattaBody showShadow frameCoordinate={this.getFrame()} />;
  }
}
