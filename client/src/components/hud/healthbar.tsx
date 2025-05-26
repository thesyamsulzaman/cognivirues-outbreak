import cx from "classnames";
import useProfile from "@/hooks/queries/use-get-profile";
import { Skeleton } from "@mantine/core";
import Sprite from "../object-graphics/sprite";
import { TILES } from "@/constants/tiles";

const Health = ({
  avatarCoordinate = TILES.HERO_RIGHT,
  name = "Peter",
  hp = 100,
  level = 1,
  status = "",
  xp = 0,
}) => {
  return (
    <div className="flex relative items-end justify-between">
      {status && (
        <div className="absolute z-10 top-0 left-1 bg-[#1e1e2f] border border-[#111] text-[3px] text-white rounded-[2px] shadow">
          {status?.toUpperCase()}
        </div>
      )}

      <div className="relative mt-[2px] ml-[3px] w-[20px] h-[20px] bg-yellow-500 border-2 border-[#222034] rounded-full flex items-end justify-center shadow-lg overflow-hidden">
        <Sprite frameCoordinate={avatarCoordinate} size={32} />
      </div>

      <div className="-ml-[5px] mb-0.5 flex flex-col items-stretch">
        <div className="flex justify-between">
          <p className="text-[3px] ml-[5.5px] tracking-[.5px] text-white max-w-[50%]">
            {name}
          </p>

          <p className="text-[3px] tracking-[.5px] text-white">Lvl {level}</p>
        </div>

        <svg
          className="w-full h-[10px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -0.5 38 9"
          shapeRendering="crispEdges"
        >
          <path
            stroke="#222034"
            d="M2 0h34M1 1h1M36 1h1M0 2h1M3 2h32M37 2h1M0 3h1M2 3h1M35 3h1M37 3h1M0 4h1M2 4h1M35 4h1M37 4h1M0 5h1M2 5h1M35 5h1M37 5h1M0 6h1M3 6h32M37 6h1M1 7h1M36 7h1M2 8h34"
          />
          <path stroke="#ffffff" d="M2 1h34" />
          <path
            stroke="#f2f2f5"
            d="M1 2h2M35 2h2M1 3h1M36 3h1M1 4h1M36 4h1M1 5h1M36 5h1M1 6h2M35 6h2M2 7h34"
          />
          <path stroke="#323c39" d="M3 3h32" />
          <path stroke="#494d4c" d="M3 4h32M3 5h32" />
          <svg x={3} y={2.5} width={32} height={3}>
            <rect
              style={{
                width: `${hp}%`,
              }}
              className={cx(`fill-[#6aff03] transition-all`, {
                "fill-red-500": hp <= 40,
                "fill-yellow-500": hp <= 60 && hp >= 40,
              })}
              height={4}
            />
          </svg>
        </svg>

        <svg
          className="border-b border-r border-white bg-[#4A4D4C] -mt-[1px]"
          x={3}
          y={7}
          width={39.7}
          height={3}
        >
          <rect
            style={{
              width: `${xp}%`,
            }}
            className="fill-[#FFD460] transition-all"
            height={4}
          />
        </svg>
      </div>
    </div>
  );
};

export default Health;
