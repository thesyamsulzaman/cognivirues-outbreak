import { InfectedType } from "@/classes/game-objects/infected-placement";
import { Direction, PLACEMENT_TYPE_INFECTED } from "./helpers";
import { TILES } from "./tiles";

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
  "self_blaming",
  "other_blaming",
];

export const CATCH_UP_DIALOGS = [
  {
    type: "message",
    skippable: true,
    text: "Hey, welcome back. The world hasn't changed much... but maybe you have.",
  },
  {
    type: "message",
    skippable: true,
    text: "The Cognivirues hides in your thoughts — let’s see how you’ve been holding up.",
  },
  {
    type: "message",
    skippable: true,
    text: "Ready to write today’s journal? Let’s catch up and run a quick scan.",
  },
];

export const GameDialogs = {
  "level-editor": [],
  "level-1": [
    {
      x: 5,
      y: 3,
      cutscene: [
        {
          withNarrator: true,
          type: "textMessage",
          text: "This island... it's too quiet. Almost fake.",
        },
      ],
    },
    {
      x: 10,
      y: 5,
      cutscene: [
        {
          withNarrator: true,
          type: "textMessage",
          text: "Wait... is that someone over there?",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "They’re still human... but barely. Look at their eyes. They’re losing it.",
        },
      ],
    },
    {
      x: 7,
      y: 9,
      cutscene: [
        {
          withNarrator: true,
          type: "textMessage",
          text: "If we don’t help them face what’s inside... they’ll turn into *that*.",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "Yeah. Those monsters used to be someone, too.",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "Welcome to Day 1. Let’s save who we can. Before the island eats them whole.",
        },
      ],
    },
  ],
  "level-2": [
    {
      x: 2,
      y: 5,
      cutscene: [
        {
          withNarrator: true,
          type: "textMessage",
          text: "There's... too many of them.",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "I tried calling out. But there’s no response now.",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "We're too late for this zone. No one’s left to save.",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "...Stay low. Stay quiet. Stay alive.",
        },
      ],
    },
  ],
  "level-3": [
    {
      x: 6,
      y: 9,
      cutscene: [
        {
          withNarrator: true,
          type: "textMessage",
          text: "This isn’t just underground. It feels... wrong.",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "Like the air itself is whispering lies.",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "Down here, the infected aren’t just scared. They’re... convinced. Of awful things.",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "We'll need to talk them down. Before the dungeon talks them in.",
        },
      ],
    },
  ],
  "level-4": [
    {
      x: 5,
      y: 8,
      cutscene: [
        {
          withNarrator: true,
          type: "textMessage",
          text: "No monsters here... but it’s not safe.",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "These puzzles... they’re not random. They’re memories. Twisted into traps.",
        },
      ],
    },
    {
      x: 3,
      y: 2,
      cutscene: [
        {
          withNarrator: true,
          type: "textMessage",
          text: "This one’s mind is tangled. Help them sort it out, and the path will open.",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "Careful. A wrong answer could stir something deeper...",
        },
      ],
    },
  ],
  "level-5": [
    {
      x: 3,
      y: 2,
      cutscene: [
        {
          withNarrator: true,
          type: "textMessage",
          text: "That water isn’t just cold. It’s fatal.",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "One slip, and you’re gone. Just like that.",
        },
      ],
    },
    {
      x: 7,
      y: 2,
      cutscene: [
        {
          withNarrator: true,
          type: "textMessage",
          text: "This one’s mind is tangled. Help them sort it out, and we'll have an access to the equipment behind him",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "We’ll need equipment to cross. Lucky he has that gear stashed nearby him.",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "Let’s move steady. One misstep, and the dungeon wins.",
        },
      ],
    },
  ],
  "level-6": [
    {
      x: 25,
      y: 14,
      cutscene: [
        {
          withNarrator: true,
          type: "textMessage",
          text: "There it is—the exit door. We’re almost out...",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "...Wait. Something’s here.",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "It’s moving—fast. It disappears and reappears wherever it wants to... like it’s skipping time and space.",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "I tried to look at it directly, but... it hurts. My chest tightens. My head spins.",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "It doesn’t speak. It just... *knows* where I am. Like it’s inside my thoughts.",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "It’s not here to fight fair. It’s here to wear us down. Break us. Make us doubt, stopping us from reaching the exit door.",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "But you’ve been with me through every level... every infected person we helped.",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "We’ve trained for this. Thought by thought. Strike by strike. Dodge them at all costs",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "Let’s finish this—together.",
        },
      ],
    },
  ],
  "level-7": [
    {
      x: 8,
      y: 1,
      cutscene: [
        {
          withNarrator: true,
          type: "textMessage",
          text: "You're still here? Heh... I guess we both made it, then.",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "Funny how a virus tried to twist my thoughts... but you helped me untangle them, one by one.",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "You didn’t just play a game. You listened. You wrote. You fought beside me.",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "I used to think escaping was the goal. Now I know—it was understanding myself.",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "Cognivirues might return. Doubts, fear, guilt... they always do. But next time, I’ll be ready.",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "And if *you* ever feel it creeping in... you know what to do. Write. Reflect. Face it head-on.",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "So... thanks, partner. For keeping me alive. For keeping *us* sane.",
        },
        {
          withNarrator: true,
          type: "textMessage",
          text: "...See you in the next journey.",
        },
      ],
    },
  ],
};

export const GameEnemies = {
  "level-editor": [],
  "level-1": [
    {
      type: PLACEMENT_TYPE_INFECTED,
      x: 6,
      y: 10,
      variant: InfectedType.Man,
    },
  ],
  "level-2": [],
  "level-3": [
    {
      type: PLACEMENT_TYPE_INFECTED,
      x: 6,
      y: 2,
      variant: InfectedType.Woman,
      direction: Direction.Left,
    },
  ],
  "level-4": [
    {
      type: PLACEMENT_TYPE_INFECTED,
      x: 5,
      y: 2,
      variant: InfectedType.Man,
      direction: Direction.Left,
    },
  ],
  "level-5": [
    {
      type: PLACEMENT_TYPE_INFECTED,
      x: 9,
      y: 2,
      variant: InfectedType.Man,
      direction: Direction.Left,
    },
  ],
  "level-6": [
    {
      type: PLACEMENT_TYPE_INFECTED,
      x: 12,
      y: 19,
      variant: InfectedType.Woman,
      direction: Direction.Left,
    },
    {
      type: PLACEMENT_TYPE_INFECTED,
      x: 38,
      y: 19,
      variant: InfectedType.Man,
      direction: Direction.Right,
    },
  ],
  "level-7": [],
};

export const TUTORIAL_DIALOGS = [
  {
    type: "message",
    skippable: true,
    text: "Hi, my name is Peter. I'm just an ordinary office worker who suddenly found myself trapped in this strange world.",
  },
  {
    type: "message",
    skippable: true,
    text: "Here, I encountered people whose faces were filled with despair. Their empty eyes and hopeless expressions felt like a shroud of darkness consuming them.",
  },
  {
    type: "message",
    skippable: true,
    text: "After investigating, I discovered they were enemy by a virus called Cognivirues.",
  },
  {
    type: "message",
    skippable: true,
    text: "I've seen its symptoms before—distorted thoughts that torment and trap its victims in endless suffering.",
  },
  {
    type: "message",
    skippable: true,
    text: "I need your help to escape this place.",
  },
  {
    type: "message",
    skippable: true,
    text: "Since this virus affects the mind, I must check on you daily to ensure you’re not enemy.",
  },
  {
    type: "message",
    skippable: true,
    text: "To do that, every time we meet, you must write and submit a journal about your day.",
  },
  {
    type: "message",
    skippable: true,
    text: "I will analyze your journal entries to identify any early signs of Cognivirues.",
  },
  {
    type: "message",
    skippable: true,
    text: "This way, I can determine whether you've been enemy.",
  },
  {
    type: "message",
    skippable: true,
    text: "Next, let me show you what you'll be facing.",
  },
  {
    type: "message",
    skippable: true,
    text: "Be warned—this world is filled with dangerous creatures. These are people whose infection has progressed too far, leaving them beyond saving.",
    additional: {
      title: "The Monsters",
      description:
        "These things used to be people, just like us. But the infection took over completely. Now they’re... gone. What’s left is just rage, fear, and noise. You’ll know them when you see them—twisted faces, weird movements, like their brains are stuck in a bad loop. They’re dangerous, and there’s no bringing them back. If you see one, don’t hesitate. Run or fight—just don’t freeze.",
      sprites: [
        { frameCoordinate: TILES.ROAMING_ENEMY_RIGHT_1, size: 32 },
        { frameCoordinate: TILES.GROUND_ENEMY_RIGHT_1, size: 32 },
        { frameCoordinate: TILES.FLYING_ENEMY_RIGHT_1, size: 32 },
        { frameCoordinate: TILES.DEMON_RUN_1_RIGHT, size: 48 },
      ],
    },
  },
  {
    type: "message",
    skippable: true,
    text: "Stay away from them. Getting too close will put both of us at risk.",
  },
  {
    type: "message",
    skippable: true,
    text: "Besides helping me escape, you must also save those who are still fighting the infection. They haven't turned yet, but they need your help to resist the virus.",
    additional: {
      title: "The Survivors",
      description:
        "Not everyone’s fully infected yet. Some people are still in there, trying to hold on. You’ll spot them—blank stares, muttering to themselves, stuck in their own heads. They’re not monsters, not yet. But they need help. Sometimes a little push is enough to snap them out of it... other times, it takes more. That’s where you come in.",
      sprites: [
        { frameCoordinate: TILES.INFECTED_MAN_RIGHT_1, size: 32 },
        { frameCoordinate: TILES.INFECTED_WOMAN_RIGHT_1, size: 32 },
      ],
    },
  },
  {
    type: "message",
    skippable: true,
    text: "I think that’s enough preparation for now. Good luck, and don’t forget to write your journal.",
  },
];

export const AttackOptions = {
  all_or_nothing_thinking: {
    id: "all_or_nothing_thinking",
    name: "All Or Nothing Thinking",
    targetType: "enemy",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!" }, // Narration
      {
        type: "textMessage",
        text: "{CASTER}: Just because you failed once doesn't mean you always will.",
      }, // Caster insight
      {
        type: "textMessage",
        text: "{TARGET}: Maybe... it's not so black and white.",
      }, // Softening reaction
      {
        type: "textMessage",
        text: "{TARGET}: I guess I’ve been ignoring the in-betweens.",
      }, // Realization
      {
        type: "textMessage",
        text: "Critical Hit! Distortion Exposed: *All Or Nothing Thinking*",
      }, // Distortion reveal
      { type: "stateChange", damage: 20 }, // Emotional damage
      { type: "textMessage", text: "{TARGET} loses 20 emotional HP!" }, // Narrate damage
      { type: "textMessage", text: "{TARGET} is beginning to heal..." }, // Healing hint
      {
        type: "textMessage",
        text: "{TARGET}: I can learn to see the gray areas.",
      }, // Growth
    ],
    failure: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!" }, // Narration
      { type: "textMessage", text: "Hmm… not quite." }, // System reaction
      {
        type: "textMessage",
        text: "{TARGET}: I'm either perfect or a complete failure.",
      }, // Negative reaction
      {
        type: "textMessage",
        text: "{TARGET}: Why even try if I can't get it all right?",
      }, // Deeper hopelessness
      { type: "stateChange", damage: 15, onCaster: true }, // Caster damage
      { type: "textMessage", text: "{CASTER} takes 15 emotional damage!" }, // Narrate damage
    ],
  },
  catastrophizing: {
    id: "catastrophizing",
    name: "Catastrophizing",
    targetType: "enemy",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
      {
        type: "textMessage",
        text: "{CASTER}: Just because something bad *could* happen, doesn’t mean it *will*.",
      },
      {
        type: "textMessage",
        text: "{TARGET}: Huh... maybe I’m jumping to conclusions.",
      },
      {
        type: "textMessage",
        text: "{TARGET}: I often assume the worst without proof.",
      },
      {
        type: "textMessage",
        text: "Critical Hit! Distortion Exposed: *Catastrophizing*",
      },
      { type: "stateChange", damage: 25 },
      { type: "textMessage", text: "{TARGET} loses 25 emotional HP!" },
      { type: "textMessage", text: "{TARGET} is beginning to heal..." },
      {
        type: "textMessage",
        text: "{TARGET}: I don’t have to fear every possibility.",
      },
    ],
    failure: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
      { type: "textMessage", text: "Hmm… not quite." },
      {
        type: "textMessage",
        text: "{TARGET}: What if everything falls apart?",
      },
      {
        type: "textMessage",
        text: "{TARGET}: It’s all going to go wrong. I just know it.",
      },
      { type: "stateChange", damage: 20, onCaster: true },
      { type: "textMessage", text: "{CASTER} takes 20 emotional damage!" },
    ],
  },

  emotional_reasoning: {
    id: "emotional_reasoning",
    name: "Emotional Reasoning",
    targetType: "enemy",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
      { type: "textMessage", text: "{CASTER}: Feelings aren't always facts." },
      { type: "textMessage", text: "{TARGET}: I... hadn’t thought of that." },
      {
        type: "textMessage",
        text: "{TARGET}: Maybe just because I *feel* worthless, doesn’t mean I *am*.",
      },
      {
        type: "textMessage",
        text: "Critical Hit! Distortion Exposed: *Emotional Reasoning*",
      },
      { type: "stateChange", damage: 22 },
      { type: "textMessage", text: "{TARGET} loses 22 emotional HP!" },
      { type: "textMessage", text: "{TARGET} is beginning to heal..." },
      {
        type: "textMessage",
        text: "{TARGET}: I can start separating feelings from facts.",
      },
    ],
    failure: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
      { type: "textMessage", text: "Hmm… not quite." },
      {
        type: "textMessage",
        text: "{TARGET}: But I *feel* like a failure, so it must be true.",
      },
      {
        type: "textMessage",
        text: "{TARGET}: These feelings prove I’m not good enough.",
      },
      { type: "stateChange", damage: 15, onCaster: true },
      { type: "textMessage", text: "{CASTER} takes 15 emotional damage!" },
    ],
  },

  fortune_telling: {
    id: "fortune_telling",
    name: "Fortune Telling",
    targetType: "enemy",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
      {
        type: "textMessage",
        text: "{CASTER}: You can’t predict the future with certainty.",
      },
      {
        type: "textMessage",
        text: "{TARGET}: I guess... I don't *know* for sure what will happen.",
      },
      {
        type: "textMessage",
        text: "{TARGET}: I’ve been acting like every bad outcome is guaranteed.",
      },
      {
        type: "textMessage",
        text: "Critical Hit! Distortion Exposed: *Fortune Telling*",
      },
      { type: "stateChange", damage: 23 },
      { type: "textMessage", text: "{TARGET} loses 23 emotional HP!" },
      { type: "textMessage", text: "{TARGET} is beginning to heal..." },
      {
        type: "textMessage",
        text: "{TARGET}: Maybe things won’t turn out so badly after all.",
      },
    ],
    failure: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
      { type: "textMessage", text: "Hmm… not quite." },
      {
        type: "textMessage",
        text: "{TARGET}: I just know it’s going to go wrong.",
      },
      {
        type: "textMessage",
        text: "{TARGET}: There’s no point trying — I’ve seen this before.",
      },
      { type: "stateChange", damage: 18, onCaster: true },
      { type: "textMessage", text: "{CASTER} takes 18 emotional damage!" },
    ],
  },

  labeling: {
    id: "labeling",
    name: "Labeling",
    targetType: "enemy",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
      {
        type: "textMessage",
        text: "{CASTER}: One mistake doesn’t define your entire identity.",
      },
      {
        type: "textMessage",
        text: "{TARGET}: I mean... I’m more than just that failure.",
      },
      {
        type: "textMessage",
        text: "{TARGET}: I’ve been reducing myself to a single word.",
      },
      {
        type: "textMessage",
        text: "Critical Hit! Distortion Exposed: *Labeling*",
      },
      { type: "stateChange", damage: 26 },
      { type: "textMessage", text: "{TARGET} loses 26 emotional HP!" },
      { type: "textMessage", text: "{TARGET} is beginning to heal..." },
      { type: "textMessage", text: "{TARGET}: I’m more complex than a label." },
    ],
    failure: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
      { type: "textMessage", text: "Hmm… not quite." },
      {
        type: "textMessage",
        text: "{TARGET}: I’m just a failure. End of story.",
      },
      {
        type: "textMessage",
        text: "{TARGET}: That’s who I am — nothing more.",
      },
      { type: "stateChange", damage: 16, onCaster: true },
      { type: "textMessage", text: "{CASTER} takes 16 emotional damage!" },
    ],
  },

  magnification_of_the_negative: {
    id: "magnification_of_the_negative",
    name: "Magnification Of The Negative",
    targetType: "enemy",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
      {
        type: "textMessage",
        text: "{CASTER}: That one setback doesn’t erase everything good.",
      },
      {
        type: "textMessage",
        text: "{TARGET}: But it felt so big… like it overshadowed everything.",
      },
      {
        type: "textMessage",
        text: "{TARGET}: Maybe... I’ve been blowing it out of proportion.",
      },
      {
        type: "textMessage",
        text: "Critical Hit! Distortion Exposed: *Magnification Of The Negative*",
      },
      { type: "stateChange", damage: 25 },
      { type: "textMessage", text: "{TARGET} loses 25 emotional HP!" },
      { type: "textMessage", text: "{TARGET} is beginning to heal..." },
      {
        type: "textMessage",
        text: "{TARGET}: I forgot to see the full picture.",
      },
    ],
    failure: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
      { type: "textMessage", text: "Hmm… not quite." },
      {
        type: "textMessage",
        text: "{TARGET}: It’s always the mistakes that stand out.",
      },
      {
        type: "textMessage",
        text: "{TARGET}: Nothing good ever really counts...",
      },
      { type: "stateChange", damage: 17, onCaster: true },
      { type: "textMessage", text: "{CASTER} takes 17 emotional damage!" },
    ],
  },

  mind_reading: {
    id: "mind_reading",
    name: "Mind Reading",
    targetType: "enemy",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
      {
        type: "textMessage",
        text: "{CASTER}: You can’t be sure what others are thinking without asking.",
      },
      { type: "textMessage", text: "{TARGET}: But… the look they gave me—" },
      { type: "textMessage", text: "{CASTER}: A look is not a sentence." },
      {
        type: "textMessage",
        text: "Critical Hit! Distortion Exposed: *Mind Reading*",
      },
      { type: "stateChange", damage: 24 },
      { type: "textMessage", text: "{TARGET} loses 24 emotional HP!" },
      { type: "textMessage", text: "{TARGET} is beginning to heal..." },
      {
        type: "textMessage",
        text: "{TARGET}: I’ve been jumping to conclusions without proof.",
      },
    ],
    failure: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
      { type: "textMessage", text: "Hmm… not quite." },
      {
        type: "textMessage",
        text: "{TARGET}: I know they think I’m a failure. I just know it.",
      },
      {
        type: "textMessage",
        text: "{TARGET}: Why would they act differently otherwise?",
      },
      { type: "stateChange", damage: 19, onCaster: true },
      { type: "textMessage", text: "{CASTER} takes 19 emotional damage!" },
    ],
  },

  minimization_of_the_positive: {
    id: "minimization_of_the_positive",
    name: "Minimization Of The Positive",
    targetType: "enemy",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
      {
        type: "textMessage",
        text: "{CASTER}: Just because something was easy doesn't mean it wasn't valuable.",
      },
      {
        type: "textMessage",
        text: "{TARGET}: It was nothing, really... anyone could’ve done it.",
      },
      {
        type: "textMessage",
        text: "{CASTER}: Why deny yourself credit for something real?",
      },
      {
        type: "textMessage",
        text: "Distortion Exposed: *Minimization Of The Positive*",
      },
      { type: "stateChange", damage: 23 },
      { type: "textMessage", text: "{TARGET} loses 23 emotional HP!" },
      {
        type: "textMessage",
        text: "{TARGET}: I guess... maybe I did do well after all.",
      },
    ],
    failure: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}..." },
      {
        type: "textMessage",
        text: "{TARGET}: It doesn’t matter. It was just luck.",
      },
      { type: "textMessage", text: "The insight doesn't break through..." },
      { type: "textMessage", text: "The distortion rebounds onto {CASTER}!" },
      { type: "stateChange", damage: 12, onCaster: true },
      { type: "textMessage", text: "{CASTER} feels emotionally drained." },
    ],
  },

  over_generalization: {
    id: "over_generalization",
    name: "Over Generalization",
    targetType: "enemy",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
      {
        type: "textMessage",
        text: "{CASTER}: One failure doesn’t mean you’ll always fail.",
      },
      {
        type: "textMessage",
        text: "{TARGET}: But I messed up once... it'll happen again.",
      },
      { type: "textMessage", text: "{CASTER}: The past isn’t prophecy." },
      {
        type: "textMessage",
        text: "Distortion Exposed: *Over Generalization*",
      },
      { type: "stateChange", damage: 22 },
      { type: "textMessage", text: "{TARGET} loses 22 emotional HP!" },
      {
        type: "textMessage",
        text: "{TARGET}: Maybe this time can be different...",
      },
    ],
    failure: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}..." },
      {
        type: "textMessage",
        text: "{TARGET}: Every time I try, it ends the same.",
      },
      {
        type: "textMessage",
        text: "The distortion twists {CASTER}'s words into hopelessness.",
      },
      { type: "stateChange", damage: 14, onCaster: true },
      { type: "textMessage", text: "{CASTER} suffers emotional backlash!" },
    ],
  },

  should_statements: {
    id: "should_statements",
    name: "Should Statements",
    targetType: "enemy",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
      {
        type: "textMessage",
        text: "{CASTER}: Who decided you *must* always be perfect?",
      },
      {
        type: "textMessage",
        text: "{TARGET}: I... I just should’ve known better.",
      },
      {
        type: "textMessage",
        text: "{CASTER}: ‘Should’ is a heavy chain you forged yourself.",
      },
      { type: "textMessage", text: "Distortion Exposed: *Should Statements*" },
      { type: "stateChange", damage: 22 },
      { type: "textMessage", text: "{TARGET} loses 22 emotional HP!" },
      {
        type: "textMessage",
        text: "{TARGET}: Maybe... I can allow myself to be human.",
      },
    ],
    failure: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}..." },
      { type: "textMessage", text: "{TARGET}: I should’ve done it better!" },
      {
        type: "textMessage",
        text: "The word ‘should’ tightens its grip on {CASTER} instead.",
      },
      { type: "stateChange", damage: 12, onCaster: true },
      { type: "textMessage", text: "{CASTER} suffers emotional backlash." },
    ],
  },

  self_blaming: {
    id: "self_blaming",
    name: "Self Blaming",
    targetType: "enemy",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
      {
        type: "textMessage",
        text: "{CASTER}: Not everything that goes wrong is your fault.",
      },
      {
        type: "textMessage",
        text: "{TARGET}: But if I were better... maybe this wouldn’t have happened.",
      },
      {
        type: "textMessage",
        text: "{CASTER}: You’re carrying guilt that was never yours.",
      },
      { type: "textMessage", text: "Distortion Exposed: *Self Blaming*" },
      { type: "stateChange", damage: 24 },
      { type: "textMessage", text: "{TARGET} loses 24 emotional HP!" },
      {
        type: "textMessage",
        text: "{TARGET}: I never thought to question that...",
      },
    ],
    failure: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}..." },
      {
        type: "textMessage",
        text: "{TARGET}: It’s still my fault. Always is.",
      },
      { type: "textMessage", text: "Guilt clings to {CASTER} instead." },
      { type: "stateChange", damage: 13, onCaster: true },
      { type: "textMessage", text: "{CASTER} suffers emotional backlash." },
    ],
  },

  other_blaming: {
    id: "other_blaming",
    name: "Other Blaming",
    targetType: "enemy",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
      {
        type: "textMessage",
        text: "{CASTER}: Sometimes blame hides the pain.",
      },
      {
        type: "textMessage",
        text: "{TARGET}: It’s all their fault—I wouldn’t be like this otherwise!",
      },
      {
        type: "textMessage",
        text: "{CASTER}: But healing starts when you reclaim your power.",
      },
      { type: "textMessage", text: "Distortion Exposed: *Other Blaming*" },
      { type: "stateChange", damage: 23 },
      { type: "textMessage", text: "{TARGET} loses 23 emotional HP!" },
      {
        type: "textMessage",
        text: "{TARGET}: Maybe it’s not only about what they did...",
      },
    ],
    failure: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}..." },
      { type: "textMessage", text: "{TARGET}: They made me this way!" },
      { type: "textMessage", text: "Rage reflects back on {CASTER}." },
      { type: "stateChange", damage: 11, onCaster: true },
      { type: "textMessage", text: "{CASTER} suffers emotional backlash." },
    ],
  },
};

export const BattleItems = {
  "recover-status": {
    name: "Heating Lamp",
    description: "Feeling fresh and warm",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} uses a {ACTION}!" },
      { type: "stateChange", status: null },
      { type: "textMessage", text: "Feeling fresh!" },
    ],
  },
  "recover-hp": {
    name: "Parmesan",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} sprinkles on some {ACTION}!" },
      { type: "stateChange", recover: 10 },
      { type: "textMessage", text: "{CASTER} recovers HP!" },
    ],
  },
};
