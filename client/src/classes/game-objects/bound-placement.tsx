import { CELL_SIZE, Direction, THEME_TILES_MAP } from "@/constants/helpers";
import Sprite from "../../components/object-graphics/sprite";
import Placement from "../placement";
import MapCell from "@/components/level-layout/map-cell";

export class BoundPlacement extends Placement {
  direction: keyof typeof Direction;

  constructor(properties, level) {
    super(properties, level);
    this.direction = properties.direction || Direction.Bottom;
  }

  isSolidForBody(_body: any): boolean {
    return true;
  }

  renderComponent(): JSX.Element | null {
    const boundTileCoordinate =
      THEME_TILES_MAP[this.level.theme as string][this.direction];

    return <Sprite frameCoordinate={boundTileCoordinate} />;
  }
}
