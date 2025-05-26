import { wait } from "@/utils/common";
import { SubmissionMenu } from "./submission-menu";
import { TextMessage } from "./text-message";

export class BattleEvent {
  battle: any;
  event: any;
  level: any;

  constructor(level, event, battle) {
    this.level = level;
    this.event = event;
    this.battle = battle;
  }

  submissionMenu(resolve) {
    const submissionMenu = new SubmissionMenu(this.battle, {
      enemy: this.event.enemy,
      caster: this.event.caster,
      items: this.battle.items,
      onComplete: (submission) => resolve(submission),
    });

    submissionMenu.init();
  }

  async givesXp(resolve) {
    let amount = this.event?.xp;
    const { combatant } = this.event;

    const step = () => {
      if (amount > 0) {
        amount -= 1;
        combatant.xp += 1;

        if (combatant?.xp === combatant?.maxHp) {
          combatant.xp = 0;
          combatant.maxHp = 100;
          combatant.level += 1;
        }

        combatant?.update();
        requestAnimationFrame(step);
        return;
      }

      resolve();
    };

    requestAnimationFrame(step);
  }

  async stateChange(resolve) {
    const { caster, target, damage, status, recover } = this.event;

    const who = this.event?.onCaster ? caster : target;

    if (damage) {
      if (this.event?.onCaster) {
        who.update({
          hp: who.hp - damage <= 0 ? 0 : who.hp - damage,
        });
      } else {
        target.update({
          hp: target.hp - damage <= 0 ? 0 : target.hp - damage,
        });
      }
    }

    // If recover comes in
    if (recover) {
      who.update({
        hp: who.hp + recover > who.maxHp ? who.maxHp : who.hp + recover,
      });
    }

    // If status comes in
    if (status) {
      who.update({
        status: { ...status },
      });
    }

    if (status === null) {
      who.update({
        status: null,
      });
    }

    await wait(600);

    resolve();
  }

  textMessage(resolve) {
    const text = this.event.text
      .replace("{CASTER}", this.event.caster?.name)
      .replace("{TARGET}", this.event.target?.name)
      .replace("{ACTION}", this.event.action?.name);

    const textMessage = new TextMessage(this.battle, {
      text,
      onComplete: () => resolve(),
    });

    textMessage.init();
  }

  init(resolve) {
    this[this.event.type](resolve);
    this.level.onEmit(this.level.getState());

    const customEvent = new CustomEvent("battle-action", {
      detail: this.event,
    });

    document.dispatchEvent(customEvent);
  }
}
