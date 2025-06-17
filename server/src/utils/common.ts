export const biasedMergeKeywordWindows = (
  windows: string[][],
  topN = 2
): string[][] => {
  if (windows.length <= topN) {
    return windows.map((window) => [...new Set(window)]);
  }

  const recentWindows = windows.slice(-topN);
  const olderWindows = windows.slice(0, -topN);
  const heaviestWindow = olderWindows
    .map((window, index) => ({ index, score: window.length }))
    .reduce((heaviest, current) =>
      current.score > heaviest.score ? current : heaviest
    );

  const selectedWindows = [
    ...recentWindows,
    olderWindows[heaviestWindow.index],
  ];

  return selectedWindows.map((window) => [...new Set(window)]);
};

export const countAndDistributeDistortions = (
  data: string[][],
  storyCount: number,
  allowedKeys?: string[]
): string[][] => {
  const countMap: Record<string, number> = {};

  // First, count the frequencies of all distortions.
  for (const entry of data) {
    for (const id of entry) {
      if (!allowedKeys || allowedKeys.includes(id)) {
        countMap[id] = (countMap[id] || 0) + 1;
      }
    }
  }

  // Create a flat list of all distortions based on their frequency.
  const allDistortions: string[] = [];
  for (const [id, freq] of Object.entries(countMap)) {
    for (let i = 0; i < freq; i++) {
      allDistortions.push(id);
    }
  }

  // Shuffle the list to ensure random distribution.
  const shuffled = allDistortions.sort(() => Math.random() - 0.5);

  // Prepare sets for each story to hold the distributed distortions.
  const storySets: Set<string>[] = Array.from(
    { length: storyCount },
    () => new Set()
  );

  // Distribute each distortion to the best available story.
  for (const distortion of shuffled) {
    // Find the story with the fewest distortions that doesn't already have this one.
    let bestStory = storySets
      .map((set, i) => ({ i, size: set.size, has: set.has(distortion) }))
      .filter((s) => !s.has)
      .sort((a, b) => a.size - b.size)[0];

    if (bestStory) {
      storySets[bestStory.i].add(distortion);
    } else {
      // If all stories already have this distortion, add it to the smallest one.
      storySets.sort((a, b) => a.size - b.size)[0].add(distortion);
    }
  }

  // Convert the sets back to arrays for the final output.
  return storySets.map((set) => Array.from(set));
};
