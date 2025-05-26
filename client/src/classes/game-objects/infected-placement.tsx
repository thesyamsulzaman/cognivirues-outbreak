import {
  Direction,
  PLACEMENT_TYPE_INFECTED,
  PLACEMENT_TYPE_INFECTED_MAN,
  PLACEMENT_TYPE_INFECTED_WOMAN,
  THEME_TILES_MAP,
  Z_INDEX_LAYER_SIZE,
} from "@/constants/helpers";
import Body from "../../components/object-graphics/body";
import Placement from "../placement";
import { TILES } from "@/constants/tiles";
import { Battle } from "../battle";
import { MessageContent, QuizzesContent } from "../../components/hud/dialog";
import distortionEntry from "../distortion-entry";
import { InfectedState } from "./infected-state";
import { JSX } from "react";

export const InfectedType = {
  Man: PLACEMENT_TYPE_INFECTED_MAN,
  Woman: PLACEMENT_TYPE_INFECTED_WOMAN,
};

export class InfectedPlacement extends Placement {
  defeatedInFrames: number;
  variant: keyof typeof InfectedType;
  state: InfectedState;

  constructor(properties, level) {
    super(properties, level);
    this.variant = properties?.variant ?? InfectedType.Man;
    this.spriteFacingDirection = this.properties?.direction || Direction.Right;
    this.defeatedInFrames = 0;
    this.state = this.properties?.state;
  }

  isSolidForBody(_body: any): boolean {
    return true;
  }

  isFacingEachOther(_body: any) {
    return (
      (this.spriteFacingDirection === Direction.Right &&
        _body.spriteFacingDirection === Direction.Left &&
        this.x < _body.x &&
        this.y === _body.y) ||
      (this.spriteFacingDirection === Direction.Left &&
        _body.spriteFacingDirection === Direction.Right &&
        this.x > _body.x &&
        this.y === _body.y) ||
      this.y + 1 === _body.y
    );
  }

  zIndex(): number {
    return this.y * Z_INDEX_LAYER_SIZE + 1;
  }

  renderComponent(): JSX.Element | null {
    const infectedFrames = this.level?.animatedFrames?.getFrame(
      this.variant,
      this.spriteFacingDirection
    );

    return <Body frameCoordinate={infectedFrames} yTranslate={1} showShadow />;
  }
}
