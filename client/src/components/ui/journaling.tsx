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
  LoadingOverlay,
} from "@mantine/core";
import { useState, Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import CognitiveDistortions from "@/data/cognitive-distortions.json";
import usePostBreakdownJournal from "@/hooks/mutations/use-post-breakdown-journal";
import usePostUpdateJournal from "@/hooks/mutations/use-put-update-journal";
import { notifications } from "@mantine/notifications";
import { useGame } from "@/contexts/game";
import {
  ActionBuilder,
  ActionOptionBuilder,
  CharacterBuilder,
} from "@/classes/character-state-builder";
import { TILES } from "@/constants/tiles";
import LoadingAiProcess from "../hud/loading-ai-process";
import { GameEnemies } from "@/constants/content";

const JournalingSteps = [
  {
    id: "journaling",
    heading: "Identify Automatic Thoughts",
    title: "Recognize Your Thoughts",
    description:
      "Begin by identifying any automatic thoughts that come to mind. These are quick, often negative thoughts that pop into your head without much conscious effort.",
  },
  {
    id: "uncover",
    heading: "Identify Distortions",
    title: "Uncover Thinking Patterns",
    description:
      "Before we proceed, take a moment to reflect on your thoughts and identify any cognitive distortions that might be influencing them. After you did so, hit the 'Verifiy' button to use AI assistance to analyze your entry and suggest possible distortions.",
  },
  {
    id: "challenge",
    heading: "Challenge the Thought",
    title: "Question Your Assumptions",
    description:
      "Challenge the validity of your automatic thoughts. Look for evidence and consider alternative explanations.",
  },
  {
    id: "alternative",
    heading: "Write an Alternative Thought",
    title: "Replace with a More Balanced Perspective",
    description:
      "Reframe your thought with a balanced, realistic perspective. Focus on facts and alternative interpretations.",
  },
];

export interface JournalFormValues {
  id?: string;
  title: string;
  body: string;
  alternative: string;
  challenge: string;
  cognitiveDistortionIds: string[];
}

export const defaultValues = {
  id: "",
  title: "",
  body: "",
  alternative: "",
  challenge: "",
  cognitiveDistortionIds: [],
};

const Journaling = ({ isOpen, onClose, onFinish }) => {
  const { levelEnemies, setLevelEnemies } = useGame({});
  const [activeStep, setActiveStep] = useState(0);
  const [analyzedDistortions, setAnalyzedDistortions] = useState<any>(null);
  const { getValues, watch, handleSubmit, register, setValue } =
    useForm<JournalFormValues>({ defaultValues });

  const currentStep = JournalingSteps[activeStep]?.id;
  const selectedDistortionIds = watch("cognitiveDistortionIds");
  const breakdownJournal = usePostBreakdownJournal();
  const updateJournal = usePostUpdateJournal();

  const handleVerifyAndSaveDistortions = async () => {
    const form = getValues();
    const newLevelEnemies = { ...levelEnemies };

    try {
      let enemiesIterationIdx = 0;
      const newAnalyzedDistortions = {};
      const newDistortionIds: Array<string> = [...selectedDistortionIds];
      const response = await breakdownJournal.mutateAsync(form);
      const distortions = response.data.journalAnalysis.distortions;
      const enemies = response?.data?.enemies;

      for (const distortion of distortions) {
        if (!selectedDistortionIds.includes(distortion?.id)) {
          newDistortionIds.push(distortion?.id);
        }

        newAnalyzedDistortions[distortion.id] = {
          type: distortion.type,
          description: distortion.description,
        };
      }

      Object.keys(GameEnemies).forEach((levelId) => {
        newLevelEnemies[levelId] = newLevelEnemies[levelId].map(
          (preloadedEnemy) => {
            const enemy = enemies[enemiesIterationIdx];
            const state = new CharacterBuilder()
              .setName(enemy?.name)
              .setDescription(enemy?.description)
              .setTile(TILES.INFECTED_MAN_LEFT_1)
              .setTeam("enemy")
              .setStats({
                xp: enemy?.xp,
                hp: enemy?.hp,
                maxXp: enemy?.maxXp,
                maxHp: enemy?.maxHp,
                level: 1,
              })
              .setIntro(enemy.intro)
              .setBackstories(enemy?.backstories)
              .setFinalRemarks(enemy?.finalRemarks)
              .addActions(
                enemy?.actions?.map((action) =>
                  new ActionBuilder()
                    .setDistortedThoughts(action?.distortedThoughts)
                    .setAnswer(action?.answer)
                    .addOptions(
                      action?.options?.map((option) => {
                        return new ActionOptionBuilder(enemy, option!, {
                          isCorrect: action.answer === option,
                        });
                      })
                    )
                )
              )
              .build();

            const enrichedEnemy = { ...preloadedEnemy, state };

            enemiesIterationIdx++;
            return enrichedEnemy;
          }
        );
      });

      setLevelEnemies(newLevelEnemies);
      setAnalyzedDistortions(newAnalyzedDistortions);
      setValue("id", response?.data?.id);
      setValue("cognitiveDistortionIds", newDistortionIds);

      notifications.show({
        title: "Awesome",
        message: response?.data?.journalAnalysis?.feedback,
        position: "top-right",
      });
    } catch (error) {
      notifications.show({
        title: "Uh, Oh.",
        message: "Something went wrong",
        position: "top-right",
        color: "red",
      });
      console.error(error);
    }
  };

  const handleNextStep = async (data) => {
    if (currentStep === "alternative") {
      await updateJournal
        .mutateAsync(data)
        .then(onFinish)
        .catch((error) => {
          console.error("Update journal error", error);
        });
    } else {
      setActiveStep((prev) => Math.min(prev + 1, JournalingSteps.length));
    }
  };

  const handlePrevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const isVerifyingDistortions =
    currentStep === "journaling" && breakdownJournal.isPending;

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = ""; // Required for most browsers
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <Modal opened={isOpen} onClose={onClose} size="70%" shadow="md" centered>
      <Stepper active={activeStep} onStepClick={setActiveStep}>
        {JournalingSteps.map((step) => (
          <Stepper.Step key={step.id} loading={isVerifyingDistortions}>
            <h2 className="text-heading-h5 mb-2">{step.title}</h2>
            <p className="text-body-normal-reguler">{step.description}</p>
          </Stepper.Step>
        ))}
        <Stepper.Completed>
          <h2 className="text-heading-h5 mb-2">Great Job!</h2>
          <p className="text-body-normal-reguler">
            Consider setting reminders to build the habit of challenging
            thoughts.
          </p>
        </Stepper.Completed>
      </Stepper>

      <LoadingOverlay
        visible={breakdownJournal.isPending}
        loaderProps={{ children: <LoadingAiProcess /> }}
        overlayProps={{ radius: "sm", blur: 5 }}
        zIndex={1000}
      />

      <form method="POST" onSubmit={handleSubmit(handleNextStep)}>
        <div className="space-y-2 my-2.5 max-h-[333px] overflow-y-auto">
          {currentStep === "journaling" && (
            <Fragment>
              <TextInput
                placeholder="Enter a journal title"
                {...register("title", { required: true })}
              />
              <Textarea
                placeholder="Write your automatic thoughts here"
                autosize
                minRows={5}
                maxLength={500}
                {...register("body", { required: true })}
              />
            </Fragment>
          )}

          {currentStep === "uncover" && (
            <Fragment>
              <Accordion
                multiple
                chevronPosition="right"
                variant="separated"
                className="my-3"
                value={selectedDistortionIds}
                onChange={(distortionIds) =>
                  setValue("cognitiveDistortionIds", distortionIds)
                }
              >
                {CognitiveDistortions.map((distortion) => (
                  <Accordion.Item value={distortion.id} key={distortion.id}>
                    <Center px="sm">
                      <Checkbox
                        size="sm"
                        checked={selectedDistortionIds.includes(distortion?.id)}
                        onChange={() => {
                          const newSelectedIds = selectedDistortionIds.includes(
                            distortion.id
                          )
                            ? selectedDistortionIds.filter(
                                (id) => id !== distortion.id
                              )
                            : [...selectedDistortionIds, distortion.id];

                          setValue("cognitiveDistortionIds", newSelectedIds);
                        }}
                      />
                      <Accordion.Control>
                        <Text className="gap-2" c="#fff">
                          {distortion.emoji}{" "}
                          <span className="ml-2">{distortion.title}</span>
                        </Text>
                        <Text size="sm" fw={400}>
                          eg: {distortion.explanation.example}
                        </Text>
                      </Accordion.Control>
                    </Center>
                    <Accordion.Panel>
                      <Text size="sm" c="gray">
                        {distortion.explanation.text}
                      </Text>

                      {!!analyzedDistortions?.[distortion?.id] && (
                        <div className="mt-2 bg-gray-800 text-gray-200 p-4 border-l-4 border-blue-500">
                          <Text size="sm">
                            {analyzedDistortions?.[distortion?.id]?.description}
                          </Text>
                        </div>
                      )}
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Fragment>
          )}

          {currentStep === "challenge" && (
            <Textarea
              placeholder="Challenge your thoughts here"
              autosize
              minRows={5}
              {...register("challenge", { required: true })}
            />
          )}

          {currentStep === "alternative" && (
            <Textarea
              placeholder="Write an alternative thought here"
              autosize
              minRows={5}
              {...register("alternative", { required: true })}
            />
          )}
        </div>

        <Group mt="lg">
          {currentStep === "uncover" && (
            <Button
              loading={breakdownJournal.isPending}
              fullWidth
              size="md"
              type="button"
              onClick={handleVerifyAndSaveDistortions}
              color="orange"
              disabled={
                selectedDistortionIds.length < 1 || breakdownJournal.isSuccess
              }
            >
              Verify Cognitive Distortions
            </Button>
          )}

          <Button
            disabled={
              breakdownJournal.isPending ||
              updateJournal.isPending ||
              (currentStep === "uncover" && !breakdownJournal.isSuccess)
            }
            fullWidth
            size="md"
            type="submit"
            id="submit"
            loading={updateJournal.isPending}
          >
            Next step
          </Button>
          <Button
            type="button"
            variant="default"
            fullWidth
            size="md"
            onClick={handlePrevStep}
            disabled={breakdownJournal.isPending || updateJournal.isPending}
          >
            Back
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default Journaling;
