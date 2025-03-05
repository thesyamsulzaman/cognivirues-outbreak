import { EditMode, EditModeType, LevelStateData } from "@/classes/level-state";
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
} from "@/constants/helpers";
import { Group, Select, Switch, Tabs, TextInput } from "@mantine/core";

const GameEditor = ({ level }: { level: LevelStateData }) => {
  const themeTiles = THEME_TILES_MAP[level?.theme as LevelThemes];

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
                level.setEditModePlacement({ type: option });
              }}
              data={[
                { label: "Wall", value: PLACEMENT_TYPE_WALL },
                { label: "Fire", value: PLACEMENT_TYPE_FIRE },
                { label: "Water", value: PLACEMENT_TYPE_WATER },
                { label: "Purple Switch", value: PLACEMENT_TYPE_SWITCH },
                { label: "Door", value: PLACEMENT_TYPE_SWITCH_DOOR },
              ]}
            />
          </div>
        </Tabs.Panel>
        <Tabs.Panel value={EditMode.MAP}>
          <div className="my-4 gap-2 space-y-3">
            {/* <Group>
              <TextInput type="number" label="Width" placeholder="1 - 20" />
              <TextInput type="number" label="Height" placeholder="1 - 20" />
            </Group>

            <Switch defaultChecked label="Floor Removal" /> */}

            <Select
              label="Select map object:"
              value={
                level?.editModeTile?.type === PLACEMENT_TYPE_BOUND
                  ? `${PLACEMENT_TYPE_BOUND}_${level?.editModeTile?.direction}`
                  : level?.editModeTile?.type
              }
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
              data={[
                { label: "Left", value: PLACEMENT_TYPE_BOUND_LEFT },
                { label: "Right", value: PLACEMENT_TYPE_BOUND_RIGHT },
                { label: "Bottom", value: PLACEMENT_TYPE_BOUND_BOTTOM },
                { label: "Top", value: PLACEMENT_TYPE_BOUND_TOP },
                { label: "Floor", value: "FLOOR" },
                { label: "Blank Floor", value: "BLANK" },
              ]}
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
