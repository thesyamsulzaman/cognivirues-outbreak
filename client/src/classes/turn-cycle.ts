export class TurnCycle {
  battle: any;
  onNewEvent: any;
  currentTeam: string;
  onWinner: any;

  constructor({ battle, onWinner, onNewEvent }: any) {
    this.battle = battle;
    this.onNewEvent = onNewEvent;
    this.currentTeam = "enemy";

    this.onWinner = onWinner;
  }

  async turn() {
    const casterId = this.battle?.activeCombatants[this.currentTeam];
    const enemyId =
      this.battle?.activeCombatants[
        this.currentTeam === "hero" ? "enemy" : "hero"
      ];

    const caster = this.battle.combatants[casterId];
    const enemy = this.battle.combatants[enemyId];

    const submission = await this.onNewEvent({
      type: "submissionMenu",
      caster,
      enemy,
    });

    /**
     * Infected Action -> distortedThoughts, finalRemarks
     * Hero Selection Action -> outcomes
     */
    const { distortedThoughts, finalRemarks, outcomes } = submission.action;

    if (distortedThoughts) {
      for (const distortedThought of distortedThoughts) {
        const event = {
          ...distortedThought,
          submission,
          action: submission.action,
          caster,
          target: submission?.target,
        };

        await this.onNewEvent(event);
      }
    }

    if (finalRemarks) {
      for (const finalRemark of finalRemarks) {
        const event = {
          ...finalRemark,
          submission,
          action: submission.action,
          caster,
          target: submission?.target,
        };

        await this.onNewEvent(event);
      }
    }

    if (outcomes) {
      for (const outcome of outcomes) {
        const event = {
          ...outcome,
          submission,
          action: submission.action,
          caster,
          target: submission?.target,
        };

        await this.onNewEvent(event);
      }
    }

    if (submission.instanceId) {
      this.battle.items = this.battle.items.filter(
        (i) => i.instanceId !== submission.instanceId
      );
    }

    //Did the target die?
    const targetDead = submission.target.hp <= 0;

    if (targetDead) {
      await this.onNewEvent({
        type: "textMessage",
        text: `${submission.target.name} is recovered!`,
      });

      if (submission?.target?.team === "enemy") {
        const heroActiveId = this.battle?.activeCombatants?.hero;
        const xp = submission?.target?.givesXp;

        await this.onNewEvent({
          type: "textMessage",
          text: `Gained ${xp} XP!`,
        });

        await this.onNewEvent({
          type: "givesXp",
          xp,
          combatant: this.battle?.combatants[heroActiveId],
        });
      }
    }

    //Do we have a winning team?
    const winner = this.getWinningTeam();

    if (winner) {
      await this.onNewEvent({
        type: "textMessage",
        text: `Battle is over`,
      });

      this.onWinner(winner);
      return;
    }

    /**
     * DO POST EVENT HERE
     */
    const postEvents = caster?.getPostEvents();

    for (const postEvent of postEvents) {
      const event = {
        ...postEvent,
        submission,
        action: submission.action,
        caster,
        target: submission?.target,
      };

      await this.onNewEvent(event);
    }

    const expiredEvent = caster.decrementStatus();
    if (expiredEvent) {
      await this.onNewEvent(expiredEvent);
    }

    this.nextTurn();
  }

  nextTurn() {
    this.currentTeam = this.currentTeam === "hero" ? "enemy" : "hero";
    this.turn();
  }

  getWinningTeam() {
    const aliveCombatans = {};

    Object.values(this.battle.combatants).forEach((combatant: any) => {
      if (combatant.hp > 0) {
        aliveCombatans[combatant.team] = true;
      }
    });

    if (!aliveCombatans["hero"]) {
      return "enemy";
    }
    if (!aliveCombatans["enemy"]) {
      return "hero";
    }

    return null;
  }

  async init() {
    await this.onNewEvent({
      type: "textMessage",
      text: "Help the infected reframe their thoughts",
    });

    const caster =
      this.battle?.combatants[this.battle?.activeCombatants["enemy"]];

    for (const { type, text } of caster.backstories) {
      await this.onNewEvent({ type, caster, text });
    }

    this.turn();
  }
}
