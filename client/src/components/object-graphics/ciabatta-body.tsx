import { TILES } from "@/constants/tiles";
import Sprite from "./sprite";

const CiabattaBody = ({
  frameCoordinate = TILES.HERO_RIGHT,
  yTranslate = 0,
  showShadow = false,
}) => {
  return (
    <div className="relative">
      <div
        className="absolute left-[-16px] top-[-33px]"
        style={{ transform: `translateY(${yTranslate}px)` }}
      >
        <Sprite frameCoordinate={frameCoordinate} size={48} />
      </div>
      <div className="scale-[2.5] relative -top-2">
        {showShadow && <Sprite frameCoordinate={TILES.SHADOW} />}
      </div>
    </div>
  );
};

export default CiabattaBody;
