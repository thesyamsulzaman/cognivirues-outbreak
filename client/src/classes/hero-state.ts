// @ts-nocheck
import { BaseCharacter, CharacterBuilder } from "./character-state-builder";
import { PersistedStorage } from "./persisted-storage";

export class HeroState implements BaseCharacter {
  // Battle fields
  hp?: number;
  actions?: Array<any>;
  isHeroControlled: boolean;

  // Storage
  storage: PersistedStorage;

  constructor() {
    const heroData = new CharacterBuilder("hero")
      .setName("Peter")
      .setDescription("Default hero")
      .setStats({
        xp: 90,
        hp: 100,
        maxXp: 100,
        maxHp: 100,
        level: 1,
      })
      .addItems([
        { actionId: "recover-status", instanceId: "p1" },
        { actionId: "recover-status", instanceId: "p2" },
      ])
      .build() as BaseCharacter;

    // Assign base values
    Object.assign(this, heroData);

    this.isHeroControlled = true;
    this.storage = new PersistedStorage({ name: "Hero" });

    const savedState = this.storage.get();

    if (Object.keys(savedState).length) {
      Object.assign(this, savedState);
    }
  }

  update(changes: Partial<BaseCharacter> = {}) {
    Object.assign(this, changes);

    this.persist();
  }

  restart() {
    this.storage.remove();
  }

  persist() {
    const state: BaseCharacter = {
      name: this.name,
      description: this.description,
      tile: this.tile,
      team: this.team,
      xp: this.xp,
      hp: this.hp,
      maxXp: this.maxXp,
      maxHp: this.maxHp,
      level: this.level,
    };

    this.storage.save(state);
  }
}
