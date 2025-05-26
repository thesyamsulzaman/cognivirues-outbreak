import React, { Fragment, useMemo } from "react";
import {
  PLACEMENT_TYPE_FIRE_PICKUP,
  PLACEMENT_TYPE_FLOUR,
  PLACEMENT_TYPE_ICE_PICKUP,
  PLACEMENT_TYPE_WATER_PICKUP,
} from "@/constants/helpers";
import { TILES } from "@/constants/tiles";
import Sprite from "../object-graphics/sprite";

const showInventory = [
  { key: PLACEMENT_TYPE_FIRE_PICKUP, tile: TILES.FIRE_PICKUP },
  { key: PLACEMENT_TYPE_ICE_PICKUP, tile: TILES.ICE_PICKUP },
  { key: PLACEMENT_TYPE_WATER_PICKUP, tile: TILES.WATER_PICKUP },
  { key: "KEY_BLUE", tile: TILES.BLUE_KEY },
  { key: "KEY_GREEN", tile: TILES.GREEN_KEY },
];

const Inventory = ({ tile, counter = null }) => (
  <div className="relative w-16 h-16 bg-yellow-400 flex justify-center items-center">
    <Fragment>
      <div className="scale-[3]">
        <Sprite frameCoordinate={tile} />
      </div>

      {counter}
    </Fragment>
  </div>
);

const InventoryList = ({ level }) => {
  const flours = useMemo(
    () =>
      level?.placements?.filter(
        (placement) => placement?.type === PLACEMENT_TYPE_FLOUR
      ),
    [level.placements]
  );

  const grabbedFlours = useMemo(
    () => flours?.filter((placement) => placement?.hasBeenCollected),
    [flours]
  );

  return (
    <div className="bg-yellow-300 p-4 rounded-lg shadow-lg relative">
      <div className="bg-yellow-600 text-white font-bold text-lg py-1 px-4 rounded-t-md text-center">
        Inventory
      </div>
      <div className="grid grid-cols-6 gap-4 p-4 bg-yellow-200 rounded-b-md">
        <Inventory
          tile={TILES.FLOUR}
          counter={
            <button className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 w-8 h-6 flex justify-center items-center text-xs">
              {grabbedFlours?.length} / {flours?.length}
            </button>
          }
        />

        {showInventory
          .filter((inventory) => level?.inventory?.has(inventory.key))
          .map((inventory) => (
            <Inventory tile={inventory.tile} key={inventory.key} />
          ))}
      </div>
    </div>
  );
};

export default InventoryList;
