import { CharacterState } from "@/constants/content";
import { randomFromArray } from "@/utils/common";

export class Combatant implements CharacterState {
  id: any | undefined;
  name: string | undefined;
  description: string | undefined;
  tile: string | undefined | undefined;
  xp: number | any;
  hp: number | any;
  maxXp: number | any;
  maxHp: number | any;
  level: number | any;
  items: { actionId: string; instanceId: string }[] | any;

  // Battle Attributes
  team: string | undefined;
  actions: Array<any> | undefined;
  intro: any[] | undefined;
  backstories: any[] | undefined;
  finalRemarks: any[] | undefined;
  battle: any;
  onUpdate: (changes) => void;
  status: any;

  constructor(battle, { config, onUpdate }) {
    this.onUpdate = onUpdate;
    this.battle = battle;

    this.applyChanges(config);
  }

  applyChanges(changes) {
    for (const property of Object.keys(changes)) {
      this[property] = changes[property];
    }
  }

  update(changes = {}) {
    this.applyChanges(changes);
    this.onUpdate(this);
  }

  getReplacedEvents(originalEvents) {
    if (
      this.status?.type === "deteroriation" &&
      randomFromArray([true, false, false])
    ) {
      return [
        {
          type: "textMessage",
          text: `${this?.name}, you're essentialy helping him to fight the same battle as you, stop being so hard on yourself`,
        },
      ];
    }

    return originalEvents;
  }

  getPostEvents() {
    if (this.status?.type === "clarity") {
      return [];
      // return [
      //   {
      //     type: "textMessage",
      //     text: "My clarity skill help me recover",
      //   },
      //   { type: "stateChange", recover: 5, onCaster: true },
      // ];
    }

    return [];
  }

  decrementStatus() {
    if (this?.status?.expiresIn > 0) {
      this?.status?.expiresIn - 1;

      if (this?.status?.expiresIn === 0) {
        this.update({ status: null });

        return {
          type: "textMessage",
          text: "Status Expired lekk",
        };
      }
    }
  }

  get hpPercent() {
    const percent = (this.hp / this.maxHp) * 100;
    return percent > 0 ? percent : 0;
  }

  get xpPercent() {
    return (this.xp / this.maxXp) * 100;
  }

  get isActive() {
    return this.battle?.activeCombatants[this.team!] === this.id;
  }

  get givesXp() {
    return this.level * 40;
  }

  init() {}
}
