/* eslint-disable no-unsafe-optional-chaining */
import { BattleItems, InfectedActions, HeroActions } from "@/constants/content";
import { KeyboardMenu } from "./keyboard-menu";

export class SubmissionMenu {
  caster: any;
  enemy: any;
  onComplete: any;
  battle: any;
  actions: any;
  keyboardMenu: KeyboardMenu | undefined;
  items: any;
  enemyAction: any;
  currentAction: any;

  constructor(battle, { caster, enemy, items, onComplete }) {
    this.battle = battle;
    this.caster = caster;
    this.enemy = enemy;

    this.onComplete = onComplete;

    this.items = Object.values(
      items.reduce((acc, item) => {
        if (item.team === caster.team) {
          if (acc[item.actionId]) {
            acc[item.actionId].quantity += 1;
          } else {
            acc[item.actionId] = {
              actionId: item.actionId,
              quantity: 1,
              instanceId: item.instanceId,
            };
          }
        }
        return acc;
      }, {})
    );
  }

  getPages() {
    const enemyAction = this.enemy?.actions[0];

    return {
      root: [
        {
          label: "Attack",
          description: "Choose a response",
          children: enemyAction?.options?.map((action) => ({
            label: action?.name,
            description: action?.description,
            handler: () => {
              this.menuSubmit(action);

              if (action?.isCorrect) {
                this?.enemy?.actions?.shift();
              }
            },
          })),
        },
        {
          label: "Items",
          description: "Choose a item",
          children: this.items.map((item) => {
            const action = BattleItems[item.actionId];

            return {
              label: action.name,
              description: action.description,
              right: `x${item.quantity}`,
              handler: () => {
                this.menuSubmit(action, item.instanceId);
              },
            };
          }),
        },
      ],
    };
  }

  showMenu() {
    this.keyboardMenu = new KeyboardMenu();
    this.keyboardMenu.setOptions(this.getPages().root);
  }

  decide() {
    const action = this.caster.actions[0];
    this.menuSubmit(action, null);
  }

  menuSubmit(action, instanceId = null) {
    this.battle.submissionMenu = null;
    this.onComplete({
      action,
      target: this.caster?.isHeroControlled ? this.enemy : this.caster,
      instanceId,
    });
  }

  init() {
    this.battle.submissionMenu = this;

    const isHero = this?.caster?.isHeroControlled;
    const actions = isHero ? this?.enemy?.actions : this?.caster?.actions;

    if (!actions?.length) {
      this.menuSubmit(
        {
          finalRemarks: this?.caster?.finalRemarks,
        },
        null
      );
      return;
    }

    isHero ? this.showMenu() : this.decide();
  }
}
