import Sprite from "../../components/object-graphics/sprite";
import Placement from "../placement";
import {
  BODY_SKINS,
  PLACEMENT_TYPE_DEMON_BOSS,
  PLACEMENT_TYPE_FIRE,
  PLACEMENT_TYPE_FIRE_PICKUP,
  PLACEMENT_TYPE_HERO,
} from "@/constants/helpers";
import { JSX } from "react";

export class FirePlacement extends Placement {
  damagesBodyOnCollide(_body: any): any {
    if (
      _body.type === PLACEMENT_TYPE_HERO &&
      !this.level.inventory.has(PLACEMENT_TYPE_FIRE_PICKUP)
    ) {
      return this.type;
    }

    if (_body.type === PLACEMENT_TYPE_DEMON_BOSS) {
      return this.type;
    }

    return null;
  }

  changesHeroSkinOnCollide(): string | null {
    return BODY_SKINS.FIRE;
  }

  renderComponent(): JSX.Element | null {
    const fireFrames =
      this.level?.animatedFrames?.getFrame(PLACEMENT_TYPE_FIRE);

    return <Sprite frameCoordinate={fireFrames} />;
  }
}
