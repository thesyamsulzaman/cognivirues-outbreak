import { EditMode } from "@/classes/level-state";
import Sprite from "../object-graphics/sprite";
import { CELL_SIZE, LevelThemes, THEME_TILES_MAP } from "@/constants/helpers";

const MapCell = ({ x, y, level, frameCoordinate }) => {
  const themeTiles = THEME_TILES_MAP[level?.theme as LevelThemes];

  const isEdgeTile =
    frameCoordinate === themeTiles.LEFT ||
    frameCoordinate === themeTiles.RIGHT ||
    frameCoordinate === themeTiles.TOP ||
    frameCoordinate === themeTiles.BOTTOM;

  const handlePlacement = () => {
    if (level.editMode === EditMode.PLACEMENT && !isEdgeTile) {
      level.addPlacement({
        x,
        y,
        ...level.editModePlacement,
      });
    }
  };

  const handleMapEditing = () => {
    const tileType = level.editModeTile?.type;

    if (tileType === "BLANK") {
      level.replaceTile({ x, y, frameCoordinate: null });
    } else if (tileType === "FLOOR") {
      level.replaceTile({ x, y, frameCoordinate: themeTiles.FLOOR });
    } else {
      level.addPlacement({ x, y, ...level.editModeTile });
    }
  };

  const onCellClick = () => {
    if (level.editMode === EditMode.MAP) {
      handleMapEditing();
    }

    if (level.editMode === EditMode.PLACEMENT) {
      handlePlacement();
    }
  };

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
