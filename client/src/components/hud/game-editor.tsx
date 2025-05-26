import { EditMode, LevelStateData } from "@/classes/level-state";
import {
  PLACEMENT_TYPE_WALL,
  PLACEMENT_TYPE_FIRE,
  PLACEMENT_TYPE_WATER,
  PLACEMENT_TYPE_SWITCH,
  PLACEMENT_TYPE_SWITCH_DOOR,
  THEME_TILES_MAP,
  LevelThemes,
  PLACEMENT_TYPE_BOUND_BOTTOM,
  PLACEMENT_TYPE_BOUND_LEFT,
  PLACEMENT_TYPE_BOUND_RIGHT,
  PLACEMENT_TYPE_BOUND_TOP,
  Direction,
  PLACEMENT_TYPE_BOUND,
  PLACEMENT_TYPE_CELEBRATION,
  PLACEMENT_TYPE_CONVEYOR,
  PLACEMENT_TYPE_FIRE_PICKUP,
  PLACEMENT_TYPE_FLOUR,
  PLACEMENT_TYPE_FLYING_ENEMY,
  PLACEMENT_TYPE_GOAL,
  PLACEMENT_TYPE_GROUND_ENEMY,
  PLACEMENT_TYPE_HERO,
  PLACEMENT_TYPE_ICE,
  PLACEMENT_TYPE_ICE_PICKUP,
  PLACEMENT_TYPE_INFECTED,
  PLACEMENT_TYPE_KEY,
  PLACEMENT_TYPE_LOCK,
  PLACEMENT_TYPE_ROAMING_ENEMY,
  PLACEMENT_TYPE_TELEPORT,
  PLACEMENT_TYPE_THIEF,
  PLACEMENT_TYPE_WATER_PICKUP,
  PLACEMENT_TYPE_CIABATTA,
  PLACEMENT_TYPE_DEMON_BOSS,
} from "@/constants/helpers";
import { Select, Tabs } from "@mantine/core";

const PlacementOptions = [
  { label: "Hero", value: PLACEMENT_TYPE_HERO },
  { label: "Goal", value: PLACEMENT_TYPE_GOAL },
  { label: "Ciabatta", value: PLACEMENT_TYPE_CIABATTA },
  { label: "Wall", value: PLACEMENT_TYPE_WALL },
  { label: "Flour", value: PLACEMENT_TYPE_FLOUR },
  { label: "Celebration", value: PLACEMENT_TYPE_CELEBRATION },
  { label: "Ground Enemy", value: PLACEMENT_TYPE_GROUND_ENEMY },
  { label: "Flying Enemy", value: PLACEMENT_TYPE_FLYING_ENEMY },
  { label: "Lock", value: PLACEMENT_TYPE_LOCK },
  { label: "Key", value: PLACEMENT_TYPE_KEY },
  { label: "Water", value: PLACEMENT_TYPE_WATER },
  { label: "Water Pickup", value: PLACEMENT_TYPE_WATER_PICKUP },
  { label: "Roaming Enemy", value: PLACEMENT_TYPE_ROAMING_ENEMY },
  { label: "Conveyor Belt", value: PLACEMENT_TYPE_CONVEYOR },
  { label: "Ice", value: PLACEMENT_TYPE_ICE },
  { label: "Ice Pickup", value: PLACEMENT_TYPE_ICE_PICKUP },
  { label: "Fire", value: PLACEMENT_TYPE_FIRE },
  { label: "Fire Pickup", value: PLACEMENT_TYPE_FIRE_PICKUP },
  { label: "Switch Door", value: PLACEMENT_TYPE_SWITCH_DOOR },
  { label: "Purple Switch", value: PLACEMENT_TYPE_SWITCH },
  { label: "Teleport", value: PLACEMENT_TYPE_TELEPORT },
  { label: "Thief", value: PLACEMENT_TYPE_THIEF },
  { label: "Infected Hero", value: PLACEMENT_TYPE_INFECTED },
  { label: "Demon Boss", value: PLACEMENT_TYPE_DEMON_BOSS },
];

const MapPlacementOptions = [
  { label: "Left", value: PLACEMENT_TYPE_BOUND_LEFT },
  { label: "Right", value: PLACEMENT_TYPE_BOUND_RIGHT },
  { label: "Bottom", value: PLACEMENT_TYPE_BOUND_BOTTOM },
  { label: "Top", value: PLACEMENT_TYPE_BOUND_TOP },
  { label: "Floor", value: "FLOOR" },
  { label: "Blank Floor", value: "BLANK" },
];

const GameEditor = ({ level }: { level: LevelStateData }) => {
  const themeTiles = THEME_TILES_MAP[level?.theme as LevelThemes];

  const mapObjectValue =
    level?.editModeTile?.type === PLACEMENT_TYPE_BOUND
      ? `${PLACEMENT_TYPE_BOUND}_${level?.editModeTile?.direction}`
      : level?.editModeTile?.type;

  return (
    <form className="bg-[#242424] p-5 rounded-md shadow-md w-[425px]">
      <Tabs
        radius="xl"
        value={level.editMode}
        variant="pills"
        onChange={(editMode: any) => level.setEditMode?.(editMode)}
      >
        <Tabs.List>
          <Tabs.Tab value={EditMode.PLACEMENT}>Placement</Tabs.Tab>
          <Tabs.Tab value={EditMode.MAP}>Map</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={EditMode.PLACEMENT}>
          <div className="my-4">
            <Select
              label="Select  Object placement:"
              placeholder="Pick value"
              value={level.editModePlacement.type}
              onChange={(option) => {
                level.setEditModePlacementType({ type: option });
              }}
              data={PlacementOptions}
            />
          </div>
        </Tabs.Panel>
        <Tabs.Panel value={EditMode.MAP}>
          <div className="my-4 gap-2 space-y-3">
            <Select
              label="Select map object:"
              value={mapObjectValue}
              onChange={(option) => {
                if (
                  option?.includes(Direction.Left) ||
                  option?.includes(Direction.Right) ||
                  option?.includes(Direction.Top) ||
                  option?.includes(Direction.Bottom)
                ) {
                  const direction = option.split("_")[1];

                  level.setEditModeTile({
                    type: PLACEMENT_TYPE_BOUND,
                    direction,
                  });
                } else {
                  level.setEditModeTile({ type: option });
                }
              }}
              data={MapPlacementOptions}
            />
          </div>
        </Tabs.Panel>
      </Tabs>

      <button
        type="button"
        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={level.copyPlacementsToClipboard}
      >
        Export
      </button>
    </form>
  );
};

export default GameEditor;
