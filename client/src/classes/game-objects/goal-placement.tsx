import { TILES } from "@/constants/tiles";
import Sprite from "../../components/object-graphics/sprite";
import Placement from "../placement";
import { PLACEMENT_TYPE_FLOUR } from "@/constants/helpers";

class GoalPlacement extends Placement {
  asPortal: boolean;

  constructor(properties, level) {
    super(properties, level);
    this.asPortal = properties.asPortal ?? false;
  }

  get isDisabled() {
    const nonCollectedFlour = this.level.placements.find((placement) => {
      return (
        placement.type === PLACEMENT_TYPE_FLOUR && !placement?.hasBeenCollected
      );
    });

    return Boolean(nonCollectedFlour);
  }

  completesLevelOnCollide() {
    return !this.isDisabled;
  }

  canBeDeleted() {
    return false;
  }

  renderComponent() {
    const portalFrame = this.isDisabled
      ? TILES.PORTAL_DISABLED
      : TILES.PORTAL_ENABLED;

    const goalFrame = this.isDisabled
      ? TILES.GOAL_DISABLED
      : TILES.GOAL_ENABLED;

    return <Sprite frameCoordinate={this.asPortal ? portalFrame : goalFrame} />;
  }
}

export default GoalPlacement;
