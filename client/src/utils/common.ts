export const distortionKeys = [
  "all_or_nothing_thinking",
  "catastrophizing",
  "emotional_reasoning",
  "fortune_telling",
  "labeling",
  "magnification_of_the_negative",
  "mind_reading",
  "minimization_of_the_positive",
  "over_generalization",
  "should_statements",
];

export const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

export const randomFromArray = (array: Array<any>) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const mergeByXY = (base, updates) => {
  const result: any = [];

  for (const b of base) {
    const match = updates.find((u) => u.x === b.x && u.y === b.y);
    if (match) {
      result.push({ ...b, ...match }); // merge properties
    } else {
      result.push(b);
    }
  }

  for (const u of updates) {
    const exists = base.find((b) => b.x === u.x && b.y === u.y);
    if (!exists) {
      result.push(u);
    }
  }

  return result;
};

export const isToday = (dateString: string) => {
  const inputDate = new Date(dateString);
  const today = new Date();
  return (
    inputDate.getFullYear() === today.getFullYear() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getDate() === today.getDate()
  );
};

export const applyOutcomeModifiers = (outcomes, context) => {
  const { enemy } = context;
  const newDamage = Math.ceil(enemy?.hp / (enemy?.actions?.length || 1));

  return outcomes?.map((outcome) => {
    switch (outcome?.type) {
      case "stateChange":
        if (!outcome?.onCaster && !outcome?.status) {
          return { ...outcome, damage: newDamage };
        }
        break;
      case "textMessage":
        if (outcome?.text?.includes("loses")) {
          return {
            ...outcome,
            text: `{TARGET} loses ${newDamage} emotional HP`,
          };
        }
        break;
    }

    return outcome;
  });
};
