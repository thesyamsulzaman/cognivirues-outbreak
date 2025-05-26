import { TILES } from "@/constants/tiles";
import { ActionBuilder, CharacterBuilder } from "../character-state-builder";

const mindReadingActions = new ActionBuilder()
  .setDistortedThoughts([
    {
      type: "textMessage",
      text: "{CASTER}: They’re all thinking I’m an idiot. I can see it in their eyes.",
    },
    {
      type: "textMessage",
      text: "{CASTER}: Everyone’s already decided I don’t belong here.",
    },
  ])
  .setAnswer("mind-reader")
  .addOptions(["mind-reader", "fortune_telling"])
  .build();

const labelingAction = new ActionBuilder()
  .setAnswer("over_generalization")
  .setDistortedThoughts([
    {
      type: "textMessage",
      text: "{CASTER}: I just know I'm a failure. What’s the point of even trying? I’ll fail again and again.",
    },
    {
      type: "textMessage",
      text: "{CASTER}: I’ve always been this way. I’m just a loser—born that way.",
    },
  ])
  .addOptions(["labeling", "over_generalization"])
  .build();

const infectedState = new CharacterBuilder()
  .setName("Jonathan")
  .setDescription("lorem ipsum dolor")
  .setTile(TILES.INFECTED_MAN_LEFT_1)
  .setTeam("enemy")
  .setStats({ xp: 30, hp: 100, maxXp: 100, maxHp: 100, level: 1 })
  .addItems([
    { actionId: "recover-status", instanceId: "p1" },
    { actionId: "recover-status", instanceId: "p2" },
  ])
  .setIntro([
    {
      type: "textMessage",
      text: "You spot Jonathan, shivering in the corner of the meeting room—haunted by his own doubts.",
    },
    {
      type: "textMessage",
      text: "His eyes dart nervously, scanning for judgment. He mutters to himself, trying to disappear.",
    },
  ])
  .setBackstories([
    {
      type: "textMessage",
      text: "Jonathan was the straight-A kid who broke down after one mistake in high school.",
    },
    {
      type: "textMessage",
      text: "He learned early that speaking up invited criticism—so he stayed silent.",
    },
    {
      type: "textMessage",
      text: "Years in the office taught him to survive, not thrive. 'Don’t stand out, don’t slip up.'",
    },
    {
      type: "textMessage",
      text: "He fears the shame of being wrong more than he desires the pride of being heard.",
    },
  ])
  .addActions([labelingAction, mindReadingActions])
  .setFinalRemarks([
    {
      type: "textMessage",
      text: "{CASTER}: Maybe I should go easy on myself.",
    },
    {
      type: "textMessage",
      text: "{CASTER}: I’ve been rehearsing apologies for a performance no one asked me to give.",
    },
    {
      type: "textMessage",
      text: "{CASTER}: It's okay to be uncertain. That doesn’t make me unworthy.",
    },
  ])

  .build();

export { infectedState };
