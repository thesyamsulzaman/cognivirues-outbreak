import { TILES } from "@/constants/tiles";
import Sprite from "../../components/object-graphics/sprite";
import Placement from "../placement";

export class DoorSwitchPlacement extends Placement {
  isRaised: boolean;

  constructor(properties, level) {
    super(properties, level);
    this.isRaised = properties.isRaised ?? true;
  }

  toggleIsRaised() {
    this.isRaised = !this.isRaised;
  }

  switchesDoorsOnCollide(body) {
    return body.interactWithGround;
  }

  renderComponent(): JSX.Element | null {
    const frameCoordinate = this.isRaised
      ? TILES.PURPLE_BUTTON_ON
      : TILES.PURPLE_BUTTON_OFF;

    return <Sprite frameCoordinate={frameCoordinate} />;
  }
}
