import { TILES } from "@/constants/tiles";
import Body from "../../components/object-graphics/body";
import Placement from "../placement";
import { GroundEnemyPlacement } from "./ground-enemy-placement";
import {
  DEMON_BOSS_ROAMING_LEFT,
  Direction,
  PLACEMENT_TYPE_ROAMING_ENEMY,
} from "@/constants/helpers";
import { Collision } from "../collision";
import { JSX } from "react";

export class RoamingEnemyPlacement extends GroundEnemyPlacement {
  tickBetweenMovesInterval: number;
  ticksUntilNextMove: number;

  constructor(properties, level) {
    super(properties, level);
    this.attackDamage = 35;
    this.tickBetweenMovesInterval = 8;
    this.ticksUntilNextMove = this.tickBetweenMovesInterval;
    this.turnAroundAtWater = true;
    this.interactWithGround = true;
  }

  onPostMove(): void | null {
    /**
     * Do not chose next move on automove
     */
    const collision = new Collision(this, this.level);

    if (collision.withPlacementMovesBody()) {
      return;
    }

    const directions = [
      Direction.Left,
      Direction.Right,
      Direction.Bottom,
      Direction.Top,
    ];

    this.movingPixelDirection =
      directions[Math.floor(Math.random() * directions.length)];
  }

  getFrame() {
    const frame = this?.level?.animatedFrames?.getFrame(
      PLACEMENT_TYPE_ROAMING_ENEMY,
      this.spriteFacingDirection
    );

    return frame;
  }

  renderComponent(): JSX.Element {
    return <Body frameCoordinate={this.getFrame()} yTranslate={0} />;
  }
}
