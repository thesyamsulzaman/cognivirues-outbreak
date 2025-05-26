import { InfectedBattleAttributes } from "@/constants/content";
import { Battle } from "./battle";
import { TextMessage } from "./text-message";

export class GameEvent {
  event: any;
  level: any;

  constructor(level, event) {
    this.level = level;
    this.event = event;
  }

  battle(resolve) {
    const battle = new Battle(this.level, {
      enemy: this.event?.enemy,
      onComplete: () => resolve(),
    });

    battle.init();
  }

  textMessage(resolve) {
    const textMessage = new TextMessage(this.level, {
      withNarrator: this.event.withNarrator || false,
      text: this.event.text,
      onComplete: () => resolve(),
    });

    textMessage.init();
  }

  init() {
    return new Promise((resolve) => {
      this[this.event.type](resolve);
      this.level.onEmit(this.level.getState());
    });
  }
}
