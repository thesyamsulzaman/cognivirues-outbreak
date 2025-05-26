import { TILES } from "@/constants/tiles";
import { PlacementTypeAnimationFrames } from "./placement-type-animation-frames";
import {
  Direction,
  PLACEMENT_TYPE_DEMON_BOSS,
  PLACEMENT_TYPE_FIRE,
  PLACEMENT_TYPE_FLYING_ENEMY,
  PLACEMENT_TYPE_GROUND_ENEMY,
  PLACEMENT_TYPE_INFECTED_MAN,
  PLACEMENT_TYPE_INFECTED_WOMAN,
  PLACEMENT_TYPE_ROAMING_ENEMY,
  PLACEMENT_TYPE_TELEPORT,
  PLACEMENT_TYPE_WATER,
} from "@/constants/helpers";

type AnimationConfig = {
  speed: number;
  sequence: {
    [Direction.Left]: string[];
    [Direction.Right]: string[];
  };
};

type FrameType = keyof typeof ANIMATIONS;

const ANIMATIONS: Record<string, AnimationConfig> = {
  [PLACEMENT_TYPE_WATER]: {
    speed: 30,
    sequence: {
      [Direction.Left]: [TILES.WATER1, TILES.WATER2],
      [Direction.Right]: [TILES.WATER1, TILES.WATER2],
    },
  },
  [PLACEMENT_TYPE_FIRE]: {
    speed: 10,
    sequence: {
      [Direction.Left]: [TILES.FIRE1, TILES.FIRE2, TILES.FIRE3],
      [Direction.Right]: [TILES.FIRE1, TILES.FIRE2, TILES.FIRE3],
    },
  },
  [PLACEMENT_TYPE_TELEPORT]: {
    speed: 10,
    sequence: {
      [Direction.Left]: [
        TILES.TELEPORT1,
        TILES.TELEPORT2,
        TILES.TELEPORT3,
        TILES.TELEPORT4,
      ],
      [Direction.Right]: [
        TILES.TELEPORT1,
        TILES.TELEPORT2,
        TILES.TELEPORT3,
        TILES.TELEPORT4,
      ],
    },
  },
  [PLACEMENT_TYPE_GROUND_ENEMY]: {
    speed: 5,
    sequence: {
      [Direction.Left]: [
        TILES.GROUND_ENEMY_LEFT_1,
        TILES.GROUND_ENEMY_LEFT_2,
        TILES.GROUND_ENEMY_LEFT_3,
        TILES.GROUND_ENEMY_LEFT_4,
      ],
      [Direction.Right]: [
        TILES.GROUND_ENEMY_RIGHT_1,
        TILES.GROUND_ENEMY_RIGHT_2,
        TILES.GROUND_ENEMY_RIGHT_3,
        TILES.GROUND_ENEMY_RIGHT_4,
      ],
    },
  },
  [PLACEMENT_TYPE_INFECTED_MAN]: {
    speed: 5,
    sequence: {
      [Direction.Left]: [
        TILES.INFECTED_MAN_LEFT_1,
        TILES.INFECTED_MAN_LEFT_2,
        TILES.INFECTED_MAN_LEFT_3,
        TILES.INFECTED_MAN_LEFT_4,
      ],
      [Direction.Right]: [
        TILES.INFECTED_MAN_RIGHT_1,
        TILES.INFECTED_MAN_RIGHT_2,
        TILES.INFECTED_MAN_RIGHT_3,
        TILES.INFECTED_MAN_RIGHT_4,
      ],
    },
  },
  [PLACEMENT_TYPE_INFECTED_WOMAN]: {
    speed: 5,
    sequence: {
      [Direction.Left]: [
        TILES.INFECTED_WOMAN_LEFT_1,
        TILES.INFECTED_WOMAN_LEFT_2,
        TILES.INFECTED_WOMAN_LEFT_3,
        TILES.INFECTED_WOMAN_LEFT_4,
      ],
      [Direction.Right]: [
        TILES.INFECTED_WOMAN_RIGHT_1,
        TILES.INFECTED_WOMAN_RIGHT_2,
        TILES.INFECTED_WOMAN_RIGHT_3,
        TILES.INFECTED_WOMAN_RIGHT_4,
      ],
    },
  },

  [PLACEMENT_TYPE_DEMON_BOSS]: {
    speed: 5,
    sequence: {
      [Direction.Left]: [
        TILES.DEMON_RUN_1_LEFT,
        TILES.DEMON_RUN_2_LEFT,
        TILES.DEMON_RUN_3_LEFT,
        TILES.DEMON_RUN_4_LEFT,
        TILES.DEMON_RUN_5_LEFT,
        TILES.DEMON_RUN_6_LEFT,
        TILES.DEMON_RUN_7_LEFT,
        TILES.DEMON_RUN_8_LEFT,
      ],
      [Direction.Right]: [
        TILES.DEMON_RUN_1_RIGHT,
        TILES.DEMON_RUN_2_RIGHT,
        TILES.DEMON_RUN_3_RIGHT,
        TILES.DEMON_RUN_4_RIGHT,
        TILES.DEMON_RUN_5_RIGHT,
        TILES.DEMON_RUN_6_RIGHT,
        TILES.DEMON_RUN_7_RIGHT,
        TILES.DEMON_RUN_8_RIGHT,
      ],
    },
  },
  [PLACEMENT_TYPE_ROAMING_ENEMY]: {
    speed: 5,
    sequence: {
      [Direction.Left]: [
        TILES.ROAMING_ENEMY_LEFT_1,
        TILES.ROAMING_ENEMY_LEFT_2,
        TILES.ROAMING_ENEMY_LEFT_3,
        TILES.ROAMING_ENEMY_LEFT_4,
        TILES.ROAMING_ENEMY_LEFT_5,
        TILES.ROAMING_ENEMY_LEFT_6,
      ],
      [Direction.Right]: [
        TILES.ROAMING_ENEMY_RIGHT_1,
        TILES.ROAMING_ENEMY_RIGHT_2,
        TILES.ROAMING_ENEMY_RIGHT_3,
        TILES.ROAMING_ENEMY_RIGHT_4,
        TILES.ROAMING_ENEMY_RIGHT_5,
        TILES.ROAMING_ENEMY_RIGHT_6,
      ],
    },
  },
  [PLACEMENT_TYPE_FLYING_ENEMY]: {
    speed: 5,
    sequence: {
      [Direction.Left]: [
        TILES.FLYING_ENEMY_LEFT_1,
        TILES.FLYING_ENEMY_LEFT_2,
        TILES.FLYING_ENEMY_LEFT_3,
        TILES.FLYING_ENEMY_LEFT_4,
      ],
      [Direction.Right]: [
        TILES.FLYING_ENEMY_RIGHT_1,
        TILES.FLYING_ENEMY_RIGHT_2,
        TILES.FLYING_ENEMY_RIGHT_3,
        TILES.FLYING_ENEMY_RIGHT_4,
      ],
    },
  },
};

export class LevelAnimatedFrames {
  private animations: Record<
    string,
    {
      [Direction.Left]: PlacementTypeAnimationFrames;
      [Direction.Right]: PlacementTypeAnimationFrames;
    }
  > = {};

  constructor() {
    for (const [key, { speed, sequence }] of Object.entries(ANIMATIONS)) {
      this.animations[key] = {
        [Direction.Left]: new PlacementTypeAnimationFrames(
          sequence[Direction.Left],
          speed
        ),
        [Direction.Right]: new PlacementTypeAnimationFrames(
          sequence[Direction.Right],
          speed
        ),
      };
    }
  }

  getFrame<T extends FrameType>(
    type: T,
    direction: Direction = Direction.Right
  ) {
    return this.animations[type]?.[direction]?.activeFrame;
  }

  tick() {
    Object.values(this.animations).forEach(({ LEFT, RIGHT }) => {
      LEFT.tick();
    });
  }
}
