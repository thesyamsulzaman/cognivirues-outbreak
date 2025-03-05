import { LevelThemes, THEME_TILES_MAP } from "@/constants/helpers";

type Params = {
  theme: string;
  tilesWidth: number;
  tilesHeight: number;
};

export type Tile = {
  x: number;
  y: number;
  frameCoordinate: string | null;
};

export default function generateBackgroundTiles({
  theme,
  tilesWidth,
  tilesHeight,
}: Params): Array<Tile> {
  const canvases: Array<Tile> = [];
  const themeTiles = THEME_TILES_MAP[theme as LevelThemes];
  const widthWithWalls = tilesWidth + 1;
  const heightWithWalls = tilesHeight + 1;

  const getBackgroundTile = (x, y) => {
    // if (x === 0) {
    //   return themeTiles.LEFT;
    // }

    // if (x === widthWithWalls) {
    //   return themeTiles.RIGHT;
    // }

    // if (y === 0) {
    //   return themeTiles.TOP;
    // }

    // if (y === heightWithWalls) {
    //   return themeTiles.BOTTOM;
    // }

    return themeTiles.FLOOR;
  };

  for (let y = 0; y <= heightWithWalls; y++) {
    for (let x = 0; x <= widthWithWalls; x++) {
      // add a cell to the map

      canvases.push({
        x,
        y,
        frameCoordinate: getBackgroundTile(x, y),
      });
    }
  }

  return canvases;
}
