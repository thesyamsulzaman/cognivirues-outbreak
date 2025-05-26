import { TILES } from "@/constants/tiles";
import Body from "../../components/object-graphics/body";
import {
  Direction,
  PLACEMENT_TYPE_GROUND_ENEMY,
  PLACEMENT_TYPE_HERO,
} from "@/constants/helpers";
import { BodyPlacement } from "./body-placement";
import soundManager, { SFX } from "../sounds";

export class GroundEnemyPlacement extends BodyPlacement {
  tickBetweenMovesInterval: number;
  ticksUntilNextMove: number;
  turnAroundAtWater: boolean;
  interactWithGround: boolean;
  damageFrames: number;
  heroPainFramesRemaining: number;

  constructor(properties, level) {
    super(properties, level);
    this.tickBetweenMovesInterval = 16;
    this.ticksUntilNextMove = this.tickBetweenMovesInterval;
    this.turnAroundAtWater = true;
    this.movingPixelDirection = properties.initialDirection ?? Direction.Right;
    this.interactWithGround = true;
    this.heroPainFramesRemaining = 0;

    this.damageFrames = 0;
  }

  tickAttemptAiMove() {
    this.checkOverlapWithHero();
    if (this.ticksUntilNextMove > 0) {
      this.ticksUntilNextMove -= 1;
      return;
    }

    this.internalMoveRequested(this.movingPixelDirection);
  }

  checkOverlapWithHero() {
    const [myX, myY] = this.displayXY();
    const [heroX, heroY] = this.level.heroRef.displayXY();

    const xDiff = Math.abs(myX - heroX);
    const yDiff = Math.abs(myY - heroY);

    if (xDiff <= 2 && yDiff <= 2) {
      this.level?.heroRef?.initiatePainFrames();
    }
  }

  tick(): void {
    super.tick();

    if (this.level.heroRef.painFramesRemaining > 0) {
      this.level.heroRef.painFramesRemaining -= 1;

      if (this.level.heroRef.painFramesRemaining === 0) {
        this.level?.heroRef?.takesDamage(this.type);
      }

      return;
    }
  }

  internalMoveRequested(direction: Direction) {
    if (this.movingPixelsRemaining > 0) {
      return;
    }

    if (this.isSolidAtNextPosition(direction)) {
      this.switchDirection();
      return;
    }

    this.ticksUntilNextMove = this.tickBetweenMovesInterval;
    this.movingPixelsRemaining = 16;
    this.movingPixelDirection = direction;
    this.updateFacingDirection();
    this.updateWalkFrame();
  }

  onAutoMovement(_direction: Direction): null {
    this.internalMoveRequested(_direction);
  }

  switchDirection() {
    const currentDirection = this.movingPixelDirection;

    if (
      currentDirection === Direction.Right ||
      currentDirection === Direction.Left
    ) {
      this.movingPixelDirection =
        this.movingPixelDirection === Direction.Left
          ? Direction.Right
          : Direction.Left;
    } else {
      this.movingPixelDirection =
        this.movingPixelDirection === Direction.Top
          ? Direction.Bottom
          : Direction.Top;
    }
  }

  renderComponent(): JSX.Element | null {
    const frameCoordinate = this.level?.animatedFrames?.getFrame(
      PLACEMENT_TYPE_GROUND_ENEMY,
      this.spriteFacingDirection
    );

    return (
      <Body
        frameCoordinate={frameCoordinate}
        yTranslate={this.getYTranslate()}
        showShadow={true}
      />
    );
  }
}
