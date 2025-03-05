import { useState, useEffect } from "react";

// Define types for player and opponent
interface Character {
  health: number;
}

interface Sequence {
  mode: "attack" | string;
  turn: number;
  message: string;
  damage: number;
}

// Define a type for the useBattleSequence hook's return type
interface UseBattleSequenceReturn {
  turn: number;
  inSequence: boolean;
  playerHealth: number;
  opponentHealth: number;
  announcerMessage: string;
}

// Define a wait function with a type annotation
export const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

export const useBattleSequence = (
  sequence: Sequence,
  { player, opponent }: { player: Character; opponent: Character }
): UseBattleSequenceReturn => {
  const [turn, setTurn] = useState<number>(0);
  const [inSequence, setInSequence] = useState<boolean>(false);

  const [playerHealth, setPlayerHealth] = useState<number>(player.health);
  const [opponentHealth, setOpponentHealth] = useState<number>(opponent.health);

  const [announcerMessage, setAnnouncerMessage] = useState<string>("");

  useEffect(() => {
    const { mode, turn, message, damage: ATTACK_DAMAGE } = sequence;

    if (mode) {
      switch (mode) {
        case "attack": {
          (async () => {
            setInSequence(true);
            setAnnouncerMessage(message);

            await wait(1000);

            /**
             * Setting up the state
             */
            if (turn === 0) {
              setOpponentHealth((h) =>
                h - ATTACK_DAMAGE > 0 ? h - ATTACK_DAMAGE : 0
              );
            } else {
              setPlayerHealth((h) =>
                h - ATTACK_DAMAGE > 0 ? h - ATTACK_DAMAGE : 0
              );
            }

            await wait(1000);

            setInSequence(false);
          })();

          break;
        }

        default:
          break;
      }
    }
  }, [opponent, player, sequence]);

  return {
    turn,
    inSequence,
    playerHealth,
    opponentHealth,
    announcerMessage,
  };
};
