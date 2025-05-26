import { LevelStateData } from "@/classes/level-state";
import MapCell from "./map-cell";
import { THEME_TILES_MAP } from "@/constants/helpers";

const LevelBackgroundTilesLayer = ({ level }: { level: LevelStateData }) => {
  const widthWithWalls = level?.tilesWidth + 1;
  const heightWithWalls = level?.tilesHeight + 1;
  const themeTiles = THEME_TILES_MAP[level.theme];

  const getTilesWithBound = () => {
    const canvases: any = [];

    function getBackgroundTile(x, y) {
      if (x === 0) {
        return themeTiles.LEFT;
      }
      if (x === widthWithWalls) {
        return themeTiles.RIGHT;
      }
      if (y === 0) {
        return themeTiles.TOP;
      }
      if (y === heightWithWalls) {
        return themeTiles.BOTTOM;
      }

      return themeTiles.FLOOR;
    }

    for (let y = 0; y <= heightWithWalls; y++) {
      for (let x = 0; x <= widthWithWalls; x++) {
        // Skip Bottom Left and Bottom Right for intentional blank tile in those corners
        if (y === heightWithWalls) {
          if (x === 0 || x === widthWithWalls) {
            continue;
          }
        }

        // add a cell to the map
        canvases.push(
          <MapCell
            key={`${x}_${y}`}
            level={level}
            x={x}
            y={y}
            frameCoordinate={getBackgroundTile(x, y)}
          />
        );
      }
    }

    return canvases;
  };

  const getTilesWithoutBound = () => {
    const canvases: any = [];

    for (let i = 0; i < level?.tiles?.length; i++) {
      const { x, y, frameCoordinate } = level.tiles[i];

      if (y === heightWithWalls) {
        if (x === 0 || x === widthWithWalls) {
          continue;
        }
      }

      // add a cell to the map
      canvases.push(
        <MapCell
          key={`${x}_${y}`}
          level={level}
          x={x}
          y={y}
          frameCoordinate={frameCoordinate}
        />
      );
    }

    return canvases;
  };

  const canvases: any = getTilesWithoutBound();

  return <div>{canvases}</div>;
};

export default LevelBackgroundTilesLayer;
