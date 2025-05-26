import {
  PLACEMENT_TYPE_HERO,
  PLACEMENT_TYPE_INFECTED,
  PLACEMENT_TYPE_INFECTED_MAN,
} from "@/constants/helpers";
import { Combatant } from "./combatant";
import { TILES } from "@/constants/tiles";
import { attacks } from "./battle-state";
import { TurnCycle } from "./turn-cycle";
import { GameLoop } from "./game-loop";
import { LevelAnimatedFrames } from "./level-animated-frame";
import { Disclosure } from "./disclosure";
import {
  HeroBattleAttributes,
  InfectedBattleAttributes,
  Pizzas,
} from "@/constants/content";
import { BattleEvent } from "./battle-event";
import { TextMessage } from "./text-message";
import { KeyboardMenu } from "./keyboard-menu";
import { SubmissionMenu } from "./submission-menu";
import { HeroState } from "./hero-state";

const items = [
  { actionId: "recover-status", instanceId: "p1", team: "hero" },
  { actionId: "recover-status", instanceId: "p2", team: "hero" },
  { actionId: "recover-status", instanceId: "p3", team: "enemy" },
  { actionId: "recover-hp", instanceId: "p4", team: "hero" },
];

export class Battle {
  level: any;
  combatants: any;
  onComplete: (didWin: boolean) => void;
  turnCycle: TurnCycle | undefined;
  screen: Disclosure;
  activeCombatants: any;

  textMessage: TextMessage | undefined;
  submissionMenu: SubmissionMenu | undefined;
  items: { actionId: string; instanceId: string; team: string }[];
  enemy: any;

  constructor(level, { enemy, onComplete }) {
    this.level = level;
    this.onComplete = onComplete;
    this.screen = new Disclosure(false, {});
    this.enemy = enemy;

    this.combatants = {};
    this.activeCombatants = {};

    [level?.heroRef, this?.enemy].forEach((combatant) => {
      this.addCombatant({
        id: combatant?.state?.name,
        team: combatant?.state?.team,
        config: combatant?.state,
      });
    });

    this.items = items;
  }

  init() {
    this?.screen?.open();
    this.level.battle = this;

    for (const combatanKey of Object.keys(this.combatants)) {
      const combatant = this.combatants[combatanKey];
      combatant.id = combatanKey;
      combatant.init();
    }

    this.turnCycle = new TurnCycle({
      battle: this,
      onWinner: (winner) => {
        if (winner === "hero") {
          this.level?.deletePlacement(this.enemy);
        } else {
          this.level?.setDeathOutcome(PLACEMENT_TYPE_INFECTED);
        }

        this.onComplete(winner);
        this.stop();
      },
      onNewEvent: (event) => {
        return new Promise((resolve) => {
          const battleEvent = new BattleEvent(this.level, event, this);
          battleEvent.init(resolve);
        });
      },
    });

    this.turnCycle.init();
  }

  addCombatant({ id, team, config }) {
    this.combatants[id] = new Combatant(this, {
      config,
      onUpdate: (changes) => {
        if (team === "hero") {
          this.level?.heroRef?.state.update(changes);
        }
      },
    });

    this.activeCombatants[team] = this.activeCombatants[team] || id;
  }

  stop() {
    this?.screen?.close();
  }
}
