import {
  Direction,
  ICE_CORNERS,
  LevelThemes,
  PLACEMENT_TYPE_CONVEYOR,
  PLACEMENT_TYPE_FLOUR,
  PLACEMENT_TYPE_FLYING_ENEMY,
  PLACEMENT_TYPE_GOAL,
  PLACEMENT_TYPE_GROUND_ENEMY,
  PLACEMENT_TYPE_HERO,
  PLACEMENT_TYPE_ICE,
  PLACEMENT_TYPE_ICE_PICKUP,
  PLACEMENT_TYPE_INFECTED_HERO,
  PLACEMENT_TYPE_KEY,
  PLACEMENT_TYPE_LOCK,
  PLACEMENT_TYPE_ROAMING_ENEMY,
  PLACEMENT_TYPE_SWITCH,
  PLACEMENT_TYPE_SWITCH_DOOR,
  PLACEMENT_TYPE_THIEF,
  PLACEMENT_TYPE_WALL,
  PLACEMENT_TYPE_WATER,
  PLACEMENT_TYPE_WATER_PICKUP,
} from "@/constants/helpers";

const level7 = {
  theme: LevelThemes.Pink,
  tilesWidth: 11,
  tilesHeight: 11,
  placements: [
    { type: PLACEMENT_TYPE_HERO, x: 1, y: 1 },
    { type: PLACEMENT_TYPE_WALL, x: 1, y: 4 },
    { type: PLACEMENT_TYPE_WALL, x: 3, y: 4 },
    { type: PLACEMENT_TYPE_WALL, x: 4, y: 4 },
    { type: PLACEMENT_TYPE_WALL, x: 1, y: 8 },
    { type: PLACEMENT_TYPE_WALL, x: 3, y: 8 },
    { type: PLACEMENT_TYPE_WALL, x: 4, y: 8 },
    { type: PLACEMENT_TYPE_WALL, x: 4, y: 9 },
    { type: PLACEMENT_TYPE_WALL, x: 4, y: 11 },
    { type: PLACEMENT_TYPE_WALL, x: 8, y: 8 },
    { type: PLACEMENT_TYPE_WALL, x: 8, y: 9 },
    { type: PLACEMENT_TYPE_WALL, x: 8, y: 11 },
    { type: PLACEMENT_TYPE_WALL, x: 9, y: 8 },
    { type: PLACEMENT_TYPE_WALL, x: 11, y: 8 },
    { type: PLACEMENT_TYPE_WALL, x: 8, y: 4 },
    { type: PLACEMENT_TYPE_WALL, x: 9, y: 4 },
    { type: PLACEMENT_TYPE_WALL, x: 8, y: 3 },
    { type: PLACEMENT_TYPE_WALL, x: 8, y: 1 },
    { type: PLACEMENT_TYPE_WALL, x: 11, y: 4 },
    { type: PLACEMENT_TYPE_ICE, x: 1, y: 7, corner: ICE_CORNERS.BOTTOM_LEFT },
    { type: PLACEMENT_TYPE_ICE, x: 2, y: 5 },
    { type: PLACEMENT_TYPE_ICE, x: 1, y: 5, corner: ICE_CORNERS.TOP_LEFT },
    { type: PLACEMENT_TYPE_ICE, x: 1, y: 6 },
    { type: PLACEMENT_TYPE_ICE, x: 2, y: 7 },
    { type: PLACEMENT_TYPE_ICE, x: 3, y: 7 },
    { type: PLACEMENT_TYPE_ICE, x: 3, y: 6 },
    { type: PLACEMENT_TYPE_ICE, x: 4, y: 6 },
    { type: PLACEMENT_TYPE_ICE, x: 4, y: 7 },
    { type: PLACEMENT_TYPE_ICE, x: 4, y: 5 },
    { type: PLACEMENT_TYPE_ICE, x: 3, y: 5 },
    { type: PLACEMENT_TYPE_ICE, x: 8, y: 5 },
    { type: PLACEMENT_TYPE_ICE, x: 9, y: 7 },
    { type: PLACEMENT_TYPE_ICE, x: 8, y: 6 },
    { type: PLACEMENT_TYPE_ICE, x: 8, y: 7 },
    { type: PLACEMENT_TYPE_ICE, x: 9, y: 6 },
    { type: PLACEMENT_TYPE_ICE, x: 9, y: 5 },
    { type: PLACEMENT_TYPE_ICE, x: 10, y: 5 },
    { type: PLACEMENT_TYPE_ICE, x: 11, y: 5, corner: ICE_CORNERS.TOP_RIGHT },
    { type: PLACEMENT_TYPE_ICE, x: 11, y: 6 },
    { type: PLACEMENT_TYPE_ICE, x: 11, y: 7, corner: ICE_CORNERS.BOTTOM_RIGHT },
    { type: PLACEMENT_TYPE_ICE, x: 5, y: 8 },
    { type: PLACEMENT_TYPE_ICE, x: 6, y: 8 },
    { type: PLACEMENT_TYPE_ICE, x: 7, y: 8 },
    { type: PLACEMENT_TYPE_ICE, x: 6, y: 9 },
    { type: PLACEMENT_TYPE_ICE, x: 5, y: 9 },
    { type: PLACEMENT_TYPE_ICE, x: 5, y: 10 },
    { type: PLACEMENT_TYPE_ICE, x: 6, y: 11 },
    { type: PLACEMENT_TYPE_ICE, x: 5, y: 11, corner: ICE_CORNERS.BOTTOM_LEFT },
    { type: PLACEMENT_TYPE_ICE, x: 7, y: 11, corner: ICE_CORNERS.BOTTOM_RIGHT },
    { type: PLACEMENT_TYPE_ICE, x: 5, y: 4 },
    { type: PLACEMENT_TYPE_ICE, x: 6, y: 4 },
    { type: PLACEMENT_TYPE_ICE, x: 7, y: 4 },
    { type: PLACEMENT_TYPE_ICE, x: 5, y: 3 },
    { type: PLACEMENT_TYPE_ICE, x: 6, y: 3 },
    { type: PLACEMENT_TYPE_ICE, x: 7, y: 3 },
    { type: PLACEMENT_TYPE_ICE, x: 7, y: 2 },
    { type: PLACEMENT_TYPE_ICE, x: 5, y: 2 },
    { type: PLACEMENT_TYPE_ICE, x: 5, y: 1, corner: ICE_CORNERS.TOP_LEFT },
    { type: PLACEMENT_TYPE_ICE, x: 6, y: 1 },
    { type: PLACEMENT_TYPE_ICE, x: 7, y: 1, corner: ICE_CORNERS.TOP_RIGHT },
    { type: PLACEMENT_TYPE_WATER, x: 5, y: 5 },
    { type: PLACEMENT_TYPE_WATER, x: 6, y: 5 },
    { type: PLACEMENT_TYPE_WATER, x: 7, y: 5 },
    { type: PLACEMENT_TYPE_WATER, x: 6, y: 7 },
    { type: PLACEMENT_TYPE_WATER, x: 5, y: 7 },
    { type: PLACEMENT_TYPE_WATER, x: 5, y: 6 },
    { type: PLACEMENT_TYPE_WATER, x: 7, y: 6 },
    { type: PLACEMENT_TYPE_WATER, x: 7, y: 7 },
    // { type: PLACEMENT_TYPE_WATER, x: 9, y: 9 },
    // { type: PLACEMENT_TYPE_WATER, x: 9, y: 11 },
    // { type: PLACEMENT_TYPE_WATER, x: 9, y: 10 },
    { type: PLACEMENT_TYPE_WATER, x: 10, y: 11 },
    { type: PLACEMENT_TYPE_WATER, x: 11, y: 11 },
    { type: PLACEMENT_TYPE_WATER, x: 11, y: 10 },
    { type: PLACEMENT_TYPE_WATER, x: 11, y: 9 },
    { type: PLACEMENT_TYPE_ICE, x: 6, y: 10 },
    { type: PLACEMENT_TYPE_ICE, x: 6, y: 2 },
    { type: PLACEMENT_TYPE_WATER_PICKUP, x: 6, y: 2 },
    { type: PLACEMENT_TYPE_WATER_PICKUP, x: 6, y: 10 },

    // {
    //   type: PLACEMENT_TYPE_INFECTED_HERO,
    //   x: 9,
    //   y: 10,
    //   direction: Direction.Right,
    // },
    { type: PLACEMENT_TYPE_ICE, x: 7, y: 9 },
    { type: PLACEMENT_TYPE_ICE, x: 7, y: 10 },
    { type: PLACEMENT_TYPE_LOCK, x: 10, y: 4, color: "GREEN" },
    { type: PLACEMENT_TYPE_LOCK, x: 10, y: 8 },
    { type: PLACEMENT_TYPE_ICE, x: 10, y: 7 },
    { type: PLACEMENT_TYPE_THIEF, x: 2, y: 6 },
    { type: PLACEMENT_TYPE_THIEF, x: 8, y: 10 },
    { type: PLACEMENT_TYPE_THIEF, x: 4, y: 10 },
    { type: PLACEMENT_TYPE_ICE, x: 10, y: 6 },
    { type: PLACEMENT_TYPE_KEY, x: 10, y: 6, color: "GREEN" },

    { type: PLACEMENT_TYPE_ICE_PICKUP, x: 2, y: 10 },
    { type: PLACEMENT_TYPE_CONVEYOR, x: 2, y: 4, direction: Direction.Top },
    { type: PLACEMENT_TYPE_CONVEYOR, x: 10, y: 9, direction: Direction.Right },
    { type: PLACEMENT_TYPE_CONVEYOR, x: 11, y: 9, direction: Direction.Bottom },

    { type: PLACEMENT_TYPE_CONVEYOR, x: 8, y: 2, direction: Direction.Left },
    { type: PLACEMENT_TYPE_WATER, x: 10, y: 10 },
    { type: PLACEMENT_TYPE_FLOUR, x: 10, y: 10 },
    { type: PLACEMENT_TYPE_KEY, x: 10, y: 2 },
    { type: PLACEMENT_TYPE_GOAL, x: 6, y: 6 },
    { type: PLACEMENT_TYPE_CONVEYOR, x: 4, y: 3, direction: Direction.Right },
  ],
};

export default level7;
