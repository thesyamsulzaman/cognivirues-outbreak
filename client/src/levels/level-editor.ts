import {
  Direction,
  LevelThemes,
  PLACEMENT_TYPE_CIABATTA,
  PLACEMENT_TYPE_CONVEYOR,
  PLACEMENT_TYPE_DEMON_BOSS,
  PLACEMENT_TYPE_FIRE,
  PLACEMENT_TYPE_FLOUR,
  PLACEMENT_TYPE_GOAL,
  PLACEMENT_TYPE_GROUND_ENEMY,
  PLACEMENT_TYPE_HERO,
  PLACEMENT_TYPE_INFECTED,
  PLACEMENT_TYPE_KEY,
  PLACEMENT_TYPE_LOCK,
  PLACEMENT_TYPE_ROAMING_ENEMY,
  PLACEMENT_TYPE_SWITCH,
  PLACEMENT_TYPE_SWITCH_DOOR,
  PLACEMENT_TYPE_THIEF,
  PLACEMENT_TYPE_WALL,
  PLACEMENT_TYPE_WATER,
  PLACEMENT_TYPE_WATER_PICKUP,
  THEME_TILES_MAP,
} from "@/constants/helpers";

const tilesHeight = 4;
const tilesWidth = 10;
const theme = LevelThemes.Green;
const themeTiles = THEME_TILES_MAP[theme];

const levelIntro = {
  theme,
  tilesHeight,
  tilesWidth,
  tiles: Array.from({ length: tilesHeight }, (_, y) =>
    Array.from({ length: tilesWidth }, (_, x) => ({
      x,
      y,
      frameCoordinate: themeTiles.FLOOR,
    }))
  ).flat(),
  placements: [
    { type: "HERO", x: 2, y: 2 },
    { type: "WALL", x: 0, y: 0 },
    { type: "WALL", x: 0, y: 1 },
    { type: "WALL", x: 0, y: 2 },
    { type: "WALL", x: 0, y: 3 },
    { type: "WALL", x: 9, y: 0 },
    { type: "WALL", x: 9, y: 2 },
    { type: "WALL", x: 9, y: 1 },
    { type: "WALL", x: 9, y: 3 },
    { type: "WALL", x: 1, y: 0 },
    { type: "WALL", x: 2, y: 0 },
    { type: "WALL", x: 3, y: 0 },
    { type: "WALL", x: 5, y: 0 },
    { type: "WALL", x: 6, y: 0 },
    { type: "WALL", x: 7, y: 0 },
    { type: "WALL", x: 8, y: 0 },
    { type: "WALL", x: 8, y: 3 },
    { type: "WALL", x: 7, y: 3 },
    { type: "WALL", x: 6, y: 3 },
    { type: "WALL", x: 5, y: 3 },
    { type: "WALL", x: 3, y: 3 },
    { type: "WALL", x: 2, y: 3 },
    { type: "WALL", x: 1, y: 3 },
    { type: "WALL", x: 3, y: 1 },
    { type: "WALL", x: 3, y: 2 },
    { type: "WALL", x: 5, y: 1 },
    { type: "WALL", x: 5, y: 2 },
    { type: "TELEPORT", x: 1, y: 2 },
    { type: "TELEPORT", x: 6, y: 2 },
  ],
};

export default levelIntro;
