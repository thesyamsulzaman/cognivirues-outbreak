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

  constructor() {
    this.storage = new PersistedStorage({ name: "Progress" });
  }

  get(): Required<Progress> {
    return {
      ...DEFAULT_PROGRESS,
      ...this.storage.get(),
    };
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

const progressEntry = new ProgressEntry();

export default progressEntry;
