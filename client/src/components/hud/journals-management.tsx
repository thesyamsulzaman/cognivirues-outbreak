import {
  Modal,
  Button,
  Group,
  Textarea,
  TextInput,
  Accordion,
  Text,
  Checkbox,
  useModalsStack,
  Card,
  Stack,
  Divider,
  Badge,
} from "@mantine/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import CognitiveDistortions from "@/data/cognitive-distortions.json";
import { defaultValues, JournalFormValues } from "../ui/journaling";
import usePostUpdateJournals from "@/hooks/mutations/use-put-update-journals";
import { notifications } from "@mantine/notifications";
import { QueryClient } from "@tanstack/react-query";
import { startCase } from "lodash";

const getRandomColor = () =>
  [
    "dark",
    "gray",
    "red",
    "pink",
    "grape",
    "violet",
    "indigo",
    "blue",
    "cyan",
    "teal",
    "green",
    "lime",
    "yellow",
    "orange",
  ][Math.floor(Math.random() * 14)];

const JournalsManagement = ({ level }) => {
  const {
    getValues,
    watch,
    handleSubmit,
    register: registerField,
    setValue,
    reset,
  } = useForm<JournalFormValues>({ defaultValues });

  const queryClient = new QueryClient();
  const updateJournal = usePostUpdateJournals();

  const journals = level?.journals;
  const journalId = watch("id");
  const selectedDistortionIds = watch("cognitiveDistortionIds");
  const journalTitle = watch("title");

  const { close, open, register } = useModalsStack([
    "journal-list",
    "journal-detail",
    "journal-delete-confirm",
  ]);

  const onUpdateJournals = (
    action: "delete" | "update",
    newJournals: any[]
  ) => {
    updateJournal
      .mutateAsync(newJournals)
      .then(() => {
        switch (action) {
          case "update":
            notifications.show({
              title: "Success",
              message: "Journal has been successfully updated",
              position: "top-right",
            });

            level.updateJournals(newJournals);

            break;

          case "delete":
            level.updateJournals(
              newJournals?.filter((journal) => !journal?._destroy)
            );

            notifications.show({
              title: "Success",
              message: "Journal has been successfully deleted",
              position: "top-right",
            });
            break;
        }

        queryClient.refetchQueries({ queryKey: ["journals"] });
      })
      .catch((error) => {
        notifications.show({
          title: "Failed",
          message: "There's something wrong",
          position: "top-right",
          color: "red",
        });

        console.error("Update journal error", error);
      });
  };

  const onUpdateJournal = (data) => {
    const newJournals = journals?.map((journal) =>
      journal?.id === data?.id ? data : journal
    );

    onUpdateJournals("update", newJournals);
    close("journal-detail");
  };

  const onSelectJournal = (selectedJournal) => {
    reset(selectedJournal);
    open("journal-detail");
  };

  const onDeleteJournal = () => {
    const newJournals = journals?.map((journal) =>
      journal?.id === journalId ? { _destroy: true, ...getValues() } : journal
    );

    onUpdateJournals("delete", newJournals);
    close("journal-delete-confirm");
    close("journal-detail");
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => open("journal-list"), []);

  return (
    <Modal.Stack>
      <Modal
        centered
        {...register("journal-list")}
        title="📝   Your Journals"
        classNames={{
          title: "!text-2xl !font-semibold",
        }}
        size="xl"
        onClose={() => {
          level.manageJournalsScreen.close();
          close("journal-list");
        }}
      >
        <div className="space-y-4 h-[470px]">
          {!!journals.length &&
            journals?.map(
              (journal) =>
                !journal?._destroy && (
                  <Card key={journal?.id} withBorder shadow="sm" radius="md">
                    <Card.Section withBorder inheritPadding py="xs">
                      <Group justify="space-between">
                        <Text fw={500} size="lg">
                          {journal?.title}
                        </Text>
                      </Group>
                    </Card.Section>

                    <Text mt="sm" c="dimmed" size="sm">
                      {journal?.body}
                    </Text>

                    <Group mt="md">
                      {journal?.cognitiveDistortionIds?.map((id) => (
                        <Badge
                          key={id}
                          color={getRandomColor()}
                          variant="light"
                        >
                          {startCase(id)}
                        </Badge>
                      ))}
                    </Group>

                    <Card.Section inheritPadding pb="md">
                      <Button
                        onClick={() => onSelectJournal(journal)}
                        color="blue"
                        fullWidth
                        mt="md"
                        radius="md"
                        size="sm"
                      >
                        Review
                      </Button>
                    </Card.Section>
                  </Card>
                )
            )}

          {!journals.length && (
            <div className="flex items-center justify-center h-full">
              <Text ta="center" size="xl" fw={500} className="text-4xl">
                Uh oh, You haven't written any journals
              </Text>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        centered
        title="📝 Review Your Journal"
        classNames={{
          title: "!text-2xl !font-semibold",
        }}
        size="70%"
        {...register("journal-detail")}
      >
        <form method="POST" onSubmit={handleSubmit(onUpdateJournal)}>
          <Stack spacing="md">
            <TextInput
              placeholder="Enter a journal title"
              label="Title"
              withAsterisk
              {...registerField("title", { required: true })}
            />

            <Textarea
              placeholder="Write your automatic thoughts here"
              autosize
              minRows={5}
              maxLength={500}
              label="Body"
              withAsterisk
              {...registerField("body", { required: true })}
            />

            <Divider label="Cognitive Distortions" labelPosition="center" />

            <Accordion
              multiple
              chevronPosition="right"
              variant="separated"
              value={selectedDistortionIds}
              onChange={(ids) => setValue("cognitiveDistortionIds", ids)}
            >
              {CognitiveDistortions.map((distortion) => (
                <Accordion.Item value={distortion.id} key={distortion.id}>
                  <Accordion.Control>
                    <Group align="start" className="items-start gap-3">
                      <Checkbox
                        size="sm"
                        checked={selectedDistortionIds.includes(distortion.id)}
                        onChange={() => {
                          const updatedIds = selectedDistortionIds.includes(
                            distortion.id
                          )
                            ? selectedDistortionIds.filter(
                                (id) => id !== distortion.id
                              )
                            : [...selectedDistortionIds, distortion.id];
                          setValue("cognitiveDistortionIds", updatedIds);
                        }}
                      />
                      <div>
                        <Text className="text-white font-medium">
                          {distortion.emoji} {distortion.title}
                        </Text>
                        <Text size="xs" color="dimmed">
                          eg: {distortion.explanation.example}
                        </Text>
                      </div>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text size="sm" color="gray.4">
                      {distortion.explanation.text}
                    </Text>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>

            <Textarea
              placeholder="Challenge your thoughts here"
              autosize
              minRows={5}
              label="Challenge"
              withAsterisk
              {...registerField("challenge")}
            />

            <Textarea
              placeholder="Write an alternative thought here"
              autosize
              minRows={5}
              label="Alternative"
              withAsterisk
              {...registerField("alternative")}
            />

            <Group position="apart" mt="md" grow>
              <Button
                variant="outline"
                color="red"
                onClick={() => open("journal-delete-confirm")}
                disabled={updateJournal.isPending}
              >
                Delete
              </Button>
              <Button
                type="submit"
                variant="filled"
                loading={updateJournal.isPending}
              >
                Update
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal
        title="Delete journal"
        centered
        {...register("journal-delete-confirm")}
      >
        <div className="space-y-4">
          <Text size="sm" color="dimmed">
            Are you sure you want to delete this journal entry? This action
            cannot be undone.
          </Text>

          {/* Optional preview of title */}
          {journalTitle && (
            <div className="p-3 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
              <Text size="sm" className="font-medium">
                "{journalTitle}"
              </Text>
            </div>
          )}

          <Group position="apart" mt="md" grow>
            <Button
              variant="default"
              onClick={() => close("journal-delete-confirm")}
              disabled={updateJournal.isPending}
            >
              Cancel
            </Button>
            <Button
              loading={updateJournal.isPending}
              color="red"
              onClick={onDeleteJournal}
            >
              Delete
            </Button>
          </Group>
        </div>
      </Modal>
    </Modal.Stack>
  );
};

export default JournalsManagement;
