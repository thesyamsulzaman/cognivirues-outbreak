import { LevelStateData } from "@/classes/level-state";
import MapCell from "./map-cell";
import { LevelThemes, THEME_TILES_MAP } from "@/constants/helpers";
import { Tile } from "@/utils/generate-background-tiles";

const LevelBackgroundTilesLayer = ({ level }: { level: LevelStateData }) => {
  const widthWithWalls = level?.tilesWidth + 1;
  const heightWithWalls = level?.tilesHeight + 1;

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

  return <div>{canvases}</div>;
};

export default LevelBackgroundTilesLayer;
