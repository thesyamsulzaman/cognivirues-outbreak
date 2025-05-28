import { PersistedStorage } from "./persisted-storage";

type Progress = {
  checkpoint?: string;
  completedLevels?: string[];
  hasCompletedTutorial?: boolean;
};

const DEFAULT_PROGRESS: Required<Progress> = {
  checkpoint: "level-1",
  completedLevels: [],
  hasCompletedTutorial: false,
};

export class ProgressEntry {
  private storage: PersistedStorage;

  constructor({ prefix }) {
    this.storage = new PersistedStorage({ name: `${prefix}-Progress` });
  }

  get(): Required<Progress>;
  get<K extends keyof Required<Progress>>(key: K): Required<Progress>[K];
  get<K extends keyof Required<Progress>>(
    key?: K
  ): Required<Progress> | Required<Progress>[K] {
    const merged = {
      ...DEFAULT_PROGRESS,
      ...this.storage.get(),
    };

    if (key) {
      return merged[key];
    }

    return merged;
  }

  save(update: Progress = {}): void {
    const current = this.get();

    const updatedProgress: Required<Progress> = {
      checkpoint: update.checkpoint ?? current.checkpoint,
      completedLevels: update.completedLevels ?? current.completedLevels,
      hasCompletedTutorial:
        update.hasCompletedTutorial ?? current.hasCompletedTutorial,
    };

    this.storage.save(updatedProgress);
  }

  reset(): void {
    this.storage.save({ ...DEFAULT_PROGRESS });
  }
}
