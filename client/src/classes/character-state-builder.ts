import { AttackOptions } from "@/constants/content";
import { applyOutcomeModifiers } from "@/utils/common";

export type BaseCharacter = {
  name: string;
  description: string;
  tile: any;
  team: "hero" | "enemy";
  xp: number;
  hp: number;
  maxXp: number;
  maxHp: number;
  level: number;
  items: any[];
  isHeroControlled?: boolean;
};

type EnemyExtras = {
  intro: any[];
  backstories: any[];
  actions: any[];
  finalRemarks: any[];
};

type HeroCharacter = BaseCharacter;
type EnemyCharacter = BaseCharacter & EnemyExtras;

type Character = HeroCharacter | EnemyCharacter;

export class CharacterBuilder {
  private isEnemy: boolean;
  private character: Character;

  constructor(type: "hero" | "enemy" = "enemy") {
    this.isEnemy = type === "enemy";

    const base: BaseCharacter = {
      name: "Unnamed",
      description: "",
      tile: undefined,
      team: type,
      xp: 0,
      hp: 0,
      maxXp: 100,
      maxHp: 100,
      level: 1,
      items: [],
    };

    this.character = this.isEnemy
      ? {
          ...base,
          intro: [],
          backstories: [],
          actions: [],
          finalRemarks: [],
        }
      : base;
  }

  setName(name: string) {
    this.character.name = name;
    return this;
  }

  setDescription(desc: string) {
    this.character.description = desc;
    return this;
  }

  setTile(tile: any) {
    this.character.tile = tile;
    return this;
  }

  setTeam(team: "hero" | "enemy") {
    this.character.team = team;
    return this;
  }

  setStats({
    xp,
    hp,
    maxXp,
    maxHp,
    level,
  }: Partial<Pick<BaseCharacter, "xp" | "hp" | "maxXp" | "maxHp" | "level">>) {
    if (xp !== undefined) this.character.xp = xp;
    if (hp !== undefined) this.character.hp = hp;
    if (maxXp !== undefined) this.character.maxXp = maxXp;
    if (maxHp !== undefined) this.character.maxHp = maxHp;
    if (level !== undefined) this.character.level = level;
    return this;
  }

  addItems(items: any[]) {
    this.character.items = items;
    return this;
  }

  setIntro(dialogue: any[]) {
    if (this.isEnemy) {
      (this.character as EnemyCharacter).intro = dialogue;
    }
    return this;
  }

  setBackstories(stories: any[]) {
    if (this.isEnemy) {
      (this.character as EnemyCharacter).backstories = stories;
    }
    return this;
  }

  addActions(actions: any[]) {
    if (this.isEnemy) {
      (this.character as EnemyCharacter).actions = actions;
    }
    return this;
  }

  setFinalRemarks(remarks: any[]) {
    if (this.isEnemy) {
      (this.character as EnemyCharacter).finalRemarks = remarks;
    }
    return this;
  }

  build(): Character {
    return this.character;
  }
}

export class ActionBuilder {
  distortedThoughts: never[];
  answer: string;
  options: any[];

  constructor() {
    this.answer = "";
    this.distortedThoughts = [];
    this.options = [];
  }

  setDistortedThoughts(thoughts) {
    this.distortedThoughts = thoughts;
    return this;
  }

  setAnswer(answer: any) {
    this.answer = answer;
    return this;
  }

  addOptions(options: any) {
    this.options = options;
    return this;
  }

  build() {
    return {
      anwer: this.answer,
      distortedThoughts: this.distortedThoughts,
      options: this.options,
    };
  }
}

export class ActionOptionBuilder {
  id: string;
  name: string;
  targetType: string;
  outcomes: never[];
  isCorrect: boolean;

  constructor(enemy, optionKey: string, { isCorrect }) {
    const option = AttackOptions[optionKey];

    this.id = option?.id;
    this.name = option?.name;
    this.targetType = option?.targetType;
    this.isCorrect = isCorrect;

    if (isCorrect) {
      this.outcomes = applyOutcomeModifiers(option?.success, { enemy });
    } else {
      this.outcomes = option?.failure;
    }
  }
}
