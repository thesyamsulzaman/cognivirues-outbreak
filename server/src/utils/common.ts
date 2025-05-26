export const slidingWindows = <T>(
  arr: T[],
  windowSize: number,
  step: number
): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i <= arr.length - windowSize; i += step) {
    result.push(arr.slice(i, i + windowSize));
  }
  return result;
};

export const biasedMergeKeywordWindows = (
  windows: string[][][],
  topN = 2
): string[][] => {
  const lastN = windows.slice(-topN);
  const scored = windows.slice(0, -topN).map((w, i) => ({
    index: i,
    score: w.flat().length, // proxy for emotional weight
  }));

  const extra = scored.sort((a, b) => b.score - a.score)[0];
  const selected = extra ? [...lastN, windows[extra.index]] : lastN;

  return selected.map((window) => [...new Set(window.flat())]);
};

export const countDistortionFrequencies = (
  data: string[][],
  allowedKeys?: string[]
): Record<string, number> => {
  const countMap: Record<string, number> = {};

  for (const entry of data) {
    for (const id of entry) {
      if (!allowedKeys || allowedKeys.includes(id)) {
        countMap[id] = (countMap[id] || 0) + 1;
      }
    }
  }

  return Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .reduce((acc, [key, val]) => {
      acc[key] = val;
      return acc;
    }, {} as Record<string, number>);
};

export const distributeDistortionsEvenly = (
  freqMap: Record<string, number>,
  storyCount: number
) => {
  const allDistortions: string[] = [];

  for (const [id, freq] of Object.entries(freqMap)) {
    for (let i = 0; i < freq; i++) {
      allDistortions.push(id);
    }
  }

  // Shuffle to randomize distribution
  const shuffled = allDistortions.sort(() => Math.random() - 0.5);

  // Distribute without duplicates in each story
  const storySets: Set<string>[] = Array.from(
    { length: storyCount },
    () => new Set()
  );

  for (const distortion of shuffled) {
    // Find the story that doesn't already have this distortion and has the least distortions
    let bestStory = storySets
      .map((set, i) => ({ i, size: set.size, has: set.has(distortion) }))
      .filter((s) => !s.has)
      .sort((a, b) => a.size - b.size)[0];

    if (bestStory) {
      storySets[bestStory.i].add(distortion);
    } else {
      // fallback: allow duplicates if needed (rare edge case)
      storySets.sort((a, b) => a.size - b.size)[0].add(distortion);
    }
  }

  return storySets.map((set) => Array.from(set));
};
