import {
  Modal,
  Button,
  Stepper,
  Group,
  Textarea,
  TextInput,
  Accordion,
  Text,
  Center,
  Checkbox,
} from "@mantine/core";
import { Fragment, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import CognitiveDistortions from "@/data/cognitive-distortions.json";
import usePostBreakdownJournal from "@/hooks/mutations/use-post-breakdown-journal";
import assign from "lodash/assign";
import omit from "lodash/omit";
import sortBy from "lodash/sortBy";

type JournalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: any) => void;
};

type FormStep = "journaling" | "uncover" | "challenge" | "alternative";

type JournalForm = {
  title: string;
  body: string;
  alternative: string;
  challenge: string;
};

const JournalingScreens = [
  {
    id: "journaling",
    heading: "Identify Automatic Thoughts",
    title: "Recognize Your Thoughts",
    description: `Begin by identifying any automatic thoughts that come to mind. These are quick, often negative thoughts that pop into your head without much conscious effort. Try to jot down these thoughts as they occur to you throughout the day.`,
  },
  {
    id: "uncover",
    heading: "Identify Distortions",
    title: "Uncover Thinking Patterns",
    description: `Let's explore the thinking patterns that could be at play. Our AI has made some initial suggestions based on your thoughts.  Review these suggestions and select the cognitive distortions that you believe best match your thinking. You can also add or remove categories as needed.`,
  },
  {
    id: "challenge",
    heading: "Challenge the Thought",
    title: "Question your assumptions",
    description: `Challenge the validity of your automatic thoughts. Ask yourself: Is there any evidence to support this thought? Are there alternative explanations for the situation? What would a friend or trusted advisor say about this thought?`,
  },
  {
    id: "alternative",
    heading: "Write an Alternative Thought",
    title: "Replace with a More Balanced Perspective",
    description: `Now, try to reframe your thought with a more balanced and realistic perspective. Focus on facts, evidence, and alternative interpretations. This will help you develop a more positive and helpful way of thinking.`,
  },
];

const defaultValues: JournalForm = {
  title: "",
  body: "",
  alternative: "",
  challenge: "",
};

const Journal = ({ isOpen, onClose }: JournalProps) => {
  const breakdownJournal = usePostBreakdownJournal();
  const [active, setActive] = useState(0);
  const [thinkingPatterns, setThinkingPatterns] = useState<any>({});

  const methods = useForm<JournalForm>({
    defaultValues: defaultValues,
  });

  const activeStep = JournalingScreens[active]?.id as FormStep;

  const onSubmit = (data) => {
    switch (activeStep) {
      case "journaling":
        if (!thinkingPatterns.length) {
          breakdownJournal
            .mutateAsync(data)
            .then((response) => {
              const distortions = response?.data?.distortions.reduce(
                (acc, distortion) => {
                  acc[distortion.key] = {
                    type: distortion.type,
                    description: distortion.description,
                  };
                  return acc;
                },
                {}
              );

              setThinkingPatterns(distortions);
              setActive((current) => (current < 3 ? current + 1 : current));
            })
            .catch((error) => console.error(error));
        } else {
          setActive((current) => (current < 3 ? current + 1 : current));
        }

        break;

      case "uncover":
      case "challenge":
      case "alternative":
        setActive((current) => (current < 3 ? current + 1 : current));
        break;

      default:
        break;
    }
  };

  const onSelectDistortion = (key: string, distortion: any) => {
    const isChecked = !!thinkingPatterns[key];

    if (isChecked) {
      setThinkingPatterns(omit(thinkingPatterns, [key]));
    } else {
      setThinkingPatterns(
        assign({}, thinkingPatterns, {
          [key]: {
            type: distortion?.title,
            // Fallback to previous distortion explaination
            description: "",
          },
        })
      );
    }
  };

  const distortionItems = useMemo(() => {
    return sortBy(
      Object.entries(CognitiveDistortions).map(([key, value]) => ({
        key, // Add the key as a property for easier access later if needed
        ...value,
      })),
      (item) => (Object.keys(thinkingPatterns).includes(item.key) ? 0 : 1)
    );
  }, [thinkingPatterns]);

  const items = distortionItems.map((distortion) => (
    <Accordion.Item value={distortion?.key} key={distortion?.title}>
      <Center px="sm">
        <Checkbox
          checked={!!thinkingPatterns[distortion?.key] || false}
          size="sm"
          onChange={() => onSelectDistortion(distortion?.key, distortion)}
        />
        <Accordion.Control>
          <Text className="gap-2" c="#fff">
            {distortion?.emoji?.map((emj) => emj)}
            <span className="ml-2">{distortion?.title}</span>
          </Text>

          <Text size="sm" fw={400}>
            eg: {distortion?.explanation?.example}
          </Text>
        </Accordion.Control>
      </Center>

      <Accordion.Panel>
        <Text
          size="sm"
          c="gray"
          bg={
            thinkingPatterns[distortion?.key]?.description
              ? "#546DE4"
              : undefined
          }
        >
          {thinkingPatterns[distortion?.key]?.description
            ? thinkingPatterns[distortion?.key]?.description
            : CognitiveDistortions[distortion?.key].explanation?.text}
        </Text>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Modal opened={isOpen} onClose={onClose} size="70%" shadow="md" centered>
      <Stepper active={active} onStepClick={setActive}>
        {JournalingScreens.map((step) => {
          return (
            <Stepper.Step
              key={step.title}
              loading={step.id === "journaling" && breakdownJournal.isPending}
            >
              <h2 className="text-heading-h5 mb-2">{step.title}</h2>
              <p
                className="text-body-normal-reguler"
                dangerouslySetInnerHTML={{ __html: step?.description }}
              />
            </Stepper.Step>
          );
        })}

        <Stepper.Completed>
          <h2 className="text-heading-h5 mb-2">Great Job !!!</h2>
          <p className="text-body-normal-reguler">
            If you'd like, you can turn on notification reminders that help you
            build up the habit of challenging thoughts.
          </p>
        </Stepper.Completed>
      </Stepper>

      <form method="POST" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="space-y-2 my-2.5 max-h-[273px] overflow-y-auto">
          {activeStep === "journaling" && (
            <Fragment>
              <TextInput
                placeholder="I had a hard time working on a SAT Test"
                {...methods.register("title", {
                  required: "Journal title is required",
                })}
              />

              <Textarea
                placeholder="I knew it should'nt have taken this test, i'll fail anyway"
                autosize
                label="Automatic Thoughts"
                minRows={5}
                {...methods.register("body", {
                  required: "Automatic thoughts are required",
                })}
              />
            </Fragment>
          )}

          {activeStep === "uncover" && (
            <Accordion
              chevronPosition="right"
              variant="separated"
              classNames={{ root: "my-3" }}
              multiple
              defaultValue={Object.keys(thinkingPatterns)}
            >
              {items}
            </Accordion>
          )}

          {activeStep === "challenge" && (
            <Textarea
              placeholder="I can't predict the future, so i don't know if i failed yet. But if i did fail, then it'd be one good experience for the next try"
              autosize
              minRows={5}
              {...methods.register("challenge", {
                required:
                  "You should fill up how you're gonna challenge your thoughts",
              })}
            />
          )}

          {activeStep === "alternative" && (
            <Textarea
              placeholder="I'm going to wait and see how it would turn out, there's nothing to lose anyway"
              autosize
              minRows={5}
              {...methods.register("alternative", {
                required: "You should fill up the alternative for your thought",
              })}
            />
          )}
        </div>

        <Group mt="lg">
          <Button
            loading={breakdownJournal.isPending}
            fullWidth
            size="md"
            type="submit"
          >
            Next step
          </Button>
          <Button
            type="button"
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
      </form>
    </Modal>
  );
};

export default Journal;
