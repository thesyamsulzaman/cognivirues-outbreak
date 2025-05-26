import { Modal, Button, Stepper, Group } from "@mantine/core";
import { useState } from "react";

type JournalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const OnboardingScreens = [
  {
    heading: "Welcome to Cognivirus",
    title: "Embark on Your Journey",
    description: `Welcome to Cognivirus, a unique RPG adventure that combines gameplay with cognitive therapy. In this game, you'll face challenges inspired by your own thoughts and feelings. Explore the dungeon, overcome obstacles, and learn valuable skills to navigate the complexities of your mind.<br/><br/> This game is heavily inspired by the <a class="text-primary" href="https://apps.apple.com/us/app/freecbt/id1516063390?pt=117847754&ct=FreeCBTWebsite&mt=8" target="_blank">FreeCBT App</a> by <a class="text-primary" href="https://erosson.org/" target="_blank">Evan Rosson</a>, which is itself a fork of the open-source project <a class="text-primary" href="https://github.com/Flaque/quirk" target="_blank">Quirk</a> by Flaque.<br/><br/> If you’re serious about learning CBT, we encourage you to start with the original resources that inspired this game. Just learn from them — they’re clear, accessible, and genuinely helpful:<br/> - <a class="text-primary" href="https://freecbt.erosson.org/" target="_blank">Free CBT Guide</a><br/> - <a class="text-primary" href="https://github.com/Flaque/quirk" target="_blank">Quirk GitHub Repository</a><br/><br/> Cognitive behavioural therapy takes practice, but it can truly help you feel better.`,
  },
  {
    heading: "The Power of Journaling",
    title: "Unlocking Your Inner World",
    description: `Cognivirues utilizes the power of journaling. Regularly recording your thoughts and feelings will not only help you understand yourself better but also shape your in-game experience. Your journal entries will influence the challenges you face, the enemies you encounter, and the rewards you unlock. <br/> <br/> Use Cognivirues in the moment when you're feeling anxious, angry, or depressed.`,
  },
];

const OnboardingPopup = ({ isOpen, onClose }: JournalProps) => {
  const [active, setActive] = useState(0);

  return (
    <Modal opened={isOpen} onClose={onClose} size="70%" shadow="md" centered>
      <div className="p-4">
        <Stepper active={active} onStepClick={setActive}>
          {OnboardingScreens.map((step) => {
            return (
              <Stepper.Step key={step.title} label={step.heading}>
                <h2 className="text-heading-h5 mb-2">{step.title}</h2>
                <p
                  className="text-body-normal-reguler"
                  dangerouslySetInnerHTML={{ __html: step?.description }}
                />
              </Stepper.Step>
            );
          })}

          <Stepper.Completed>
            <h2 className="text-heading-h5 mb-2">
              Ready to Begin Your Adventure?
            </h2>
            <p className="text-body-normal-reguler">
              It's time to embark on your journey! Create your character and
              begin exploring the mysterious dungeon. Remember to write in your
              journal daily to unlock the full potential of your Cognivirues
              experience. Good luck!
            </p>
          </Stepper.Completed>
        </Stepper>
      </div>

      <Group mt="sm">
        <Button
          fullWidth
          size="md"
          onClick={() => {
            if (active === OnboardingScreens.length - 1) {
              onClose();
            } else {
              setActive((current) => (current < 3 ? current + 1 : current));
            }
          }}
        >
          Next step
        </Button>
        <Button
          variant="default"
          fullWidth
          size="md"
          onClick={() => {
            setActive((current) => (current > 0 ? current - 1 : current));
          }}
        >
          Back
        </Button>
      </Group>
    </Modal>
  );
};

export default OnboardingPopup;
