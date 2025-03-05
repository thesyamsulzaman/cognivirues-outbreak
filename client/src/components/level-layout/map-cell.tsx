import { EditMode } from "@/classes/level-state";
import Sprite from "../object-graphics/sprite";
import {
  CELL_SIZE,
  LevelThemes,
  PLACEMENT_TYPE_BOUND,
  THEME_TILES_MAP,
} from "@/constants/helpers";

const MapCell = ({ x, y, level, frameCoordinate }) => {
  const themeTiles = THEME_TILES_MAP[level?.theme as LevelThemes];

  const edges =
    frameCoordinate === themeTiles.LEFT ||
    frameCoordinate === themeTiles.RIGHT ||
    frameCoordinate === themeTiles.TOP ||
    frameCoordinate === themeTiles.BOTTOM;

  const onCellClick = () => {
    if (level.editMode === EditMode.PLACEMENT && !edges) {
      level.addPlacement({
        x: x,
        y: y,
        ...level.editModePlacement,
      });
    }

    if (level.editMode === EditMode.MAP) {
      switch (level.editModeTile?.type) {
        case "BLANK":
          level.replaceTile({
            x: x,
            y: y,
            frameCoordinate: null,
          });
          break;

        case "FLOOR":
          level.replaceTile({
            x: x,
            y: y,
            frameCoordinate: themeTiles.FLOOR,
          });
          break;

        default:
          level.addPlacement({
            x: x,
            y: y,
            ...level.editModeTile,
          });
          break;
      }
    }
  };

  // console.log("frame", frameCoordinate);

  return (
    <div
      className="absolute"
      style={{ left: x * CELL_SIZE, top: y * CELL_SIZE }}
      onClick={onCellClick}
    >
      {frameCoordinate ? (
        <Sprite frameCoordinate={frameCoordinate} />
      ) : (
        <canvas />
      )}
    </div>
  );
};

export default MapCell;
