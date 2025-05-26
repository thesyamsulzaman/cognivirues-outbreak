import { TILES } from "@/constants/tiles";
import Sprite from "../../components/object-graphics/sprite";
import Placement from "../placement";
import Body from "../../components/object-graphics/body";
import { Direction, PLACEMENT_TYPE_FLYING_ENEMY } from "@/constants/helpers";
import { BodyPlacement } from "./body-placement";
import { GroundEnemyPlacement } from "./ground-enemy-placement";

export class FlyingEnemyPlacement extends GroundEnemyPlacement {
  tickBetweenMovesInterval: number;
  ticksUntilNextMove: number;

  constructor(properties, level) {
    super(properties, level);
    this.attackDamage = 30;
    this.tickBetweenMovesInterval = 20;
    this.ticksUntilNextMove = this.tickBetweenMovesInterval;
    this.turnAroundAtWater = false;
    this.interactWithGround = false;
  }

  renderComponent(): JSX.Element | null {
    const frameCoordinate = this.level?.animatedFrames?.getFrame(
      PLACEMENT_TYPE_FLYING_ENEMY,
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
