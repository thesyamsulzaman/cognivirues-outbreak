import {
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import cx from "classnames";
import { KeyboardMenuOption } from "@/classes/keyboard-menu";
import { Card, Image, Modal, SimpleGrid, Text } from "@mantine/core";
import { noop } from "lodash";
import { useDisclosure } from "@mantine/hooks";
import Sprite from "../object-graphics/sprite";
import { TILES } from "@/constants/tiles";

export enum DialogContentType {
  Message = "message",
  Quizzes = "quizzes",
}

type BaseContent = {
  type: DialogContentType;
  text: string;
};

export type MessageContent = BaseContent & {
  skippable?: boolean;
  additional?: any;
};

export type DialogType = Array<MessageContent>;

type DialogProps = {
  isOpen?: boolean;
  onClose?: () => void;
  content?: DialogType;
  leftSection?: ReactNode;
  onComplete?: () => void;
};

export const DialogContainer = ({ children }) => (
  <div className="absolute bottom-0 inset-x-0 flex flex-col border-t-[4px] border-[var(--menu-border-color)] rounded-sm bg-[var(--menu-background)] text-[var(--menu-font-color)] h-[200px]">
    <div className="grow flex flex-col min-h-0">{children}</div>
  </div>
);

export const TextMessageDisplay = ({
  content = [],
  leftSection,
  onComplete,
}: DialogProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTextFullyDisplayed, setIsTextFullyDisplayed] = useState(false);

  const [additionalModalOpened, additionalModal] = useDisclosure(false, {
    onClose: () => {
      onNextDialog();
    },
  });

  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentDialog = content[currentIndex];
  const isLastDialog = currentIndex >= content.length - 1;

  const onNextDialog = useCallback(() => {
    if (isLastDialog) {
      onComplete?.();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [isLastDialog, onComplete]);

  useEffect(() => {
    if (
      currentDialog?.type === DialogContentType.Message &&
      (currentDialog as MessageContent)?.skippable
    ) {
      let keySafe = true;

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.code === "Enter" && keySafe) {
          keySafe = false;

          if (!isTextFullyDisplayed) {
            if (typingIntervalRef.current) {
              clearInterval(typingIntervalRef.current);
              typingIntervalRef.current = null;
            }

            setDisplayedText(currentDialog?.text ?? "");
            setIsTextFullyDisplayed(true);
          } else {
            if (currentDialog.additional) {
              additionalModal.open();
            } else {
              onNextDialog();
            }
          }
        }
      };

      const onKeyUp = (event: KeyboardEvent) => {
        if (event.code === "Enter") {
          keySafe = true;
        }
      };

      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("keyup", onKeyUp);

      return () => {
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("keyup", onKeyUp);
      };
    }
  }, [currentDialog, onNextDialog, isTextFullyDisplayed, additionalModal]);

  useEffect(() => {
    let i = 0;
    setIsTextFullyDisplayed(false);
    const fullText = currentDialog?.text ?? "";

    typingIntervalRef.current = setInterval(() => {
      i++;
      setDisplayedText(fullText.slice(0, i));

      if (i >= fullText.length) {
        clearInterval(typingIntervalRef.current!);
        typingIntervalRef.current = null;
        setIsTextFullyDisplayed(true);
      }
    }, 20);

    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    };
  }, [currentDialog?.text]);

  return (
    <DialogContainer>
      <Modal
        size="lg"
        opened={additionalModalOpened}
        onClose={additionalModal.close}
      >
        <div className="flex items-center justify-center mb-10">
          {currentDialog?.additional?.sprites.map(
            ({ size, frameCoordinate }, idx) => (
              <div
                key={idx}
                className="scale-[3] flex justify-center flex-1 py-1"
              >
                <Sprite frameCoordinate={frameCoordinate} size={size} />
              </div>
            )
          )}
        </div>
        <Text fw={500}>{currentDialog?.additional?.title}</Text>
        <Text size="sm" c="dimmed">
          {currentDialog?.additional?.description}
        </Text>
      </Modal>

      <div className="flex items-start grow min-h-0">
        {leftSection}
        <p
          className="w-4/5 text-5xl m-0 px-5 py-3 h-[calc(100%-10px)] overflow-y-scroll"
          dangerouslySetInnerHTML={{ __html: displayedText }}
        />
      </div>
    </DialogContainer>
  );
};

export const ActionMenuDisplay = ({
  options,
  text,
  onComplete,
}: {
  text: string;
  options: Array<KeyboardMenuOption>;
  onComplete?: () => void;
}) => {
  const [ready, setReady] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [currentOptions, setCurrentOptions] = useState(options);
  const [history, setHistory] = useState<Array<Array<KeyboardMenuOption>>>([]);

  const buttons =
    document.querySelectorAll<HTMLButtonElement>("[data-menu-button]");

  const handleOptionSelect = (option: KeyboardMenuOption) => {
    if (!ready || option.disabled) return;

    if (option.children?.length > 0) {
      setHistory((prev) => [...prev, currentOptions]);
      setCurrentOptions(option.children);
      setFocusedIndex(0);
    } else {
      option.handler?.();
    }
  };

  const handleBack = () => {
    const previous = [...history];
    const last = previous.pop();
    setHistory(previous);
    setCurrentOptions(last || []);
    setFocusedIndex(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const total = buttons.length;

      if (["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === "ArrowDown") {
        setFocusedIndex((prev) => (prev + 1) % total);
      } else if (e.key === "ArrowUp") {
        setFocusedIndex((prev) => (prev - 1 + total) % total);
      } else if (e.key === "Enter") {
        buttons[focusedIndex]?.click();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [buttons, focusedIndex]);

  useEffect(() => {
    buttons[focusedIndex]?.focus();
  }, [focusedIndex, currentOptions, buttons]);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <DialogContainer>
      <div className="flex items-start grow min-h-0">
        <p
          className="w-7/12 text-5xl m-0 px-5 py-3 h-[calc(100%-10px)] overflow-y-scroll"
          dangerouslySetInnerHTML={{ __html: text }}
        />

        <div className="relative w-5/12 h-full">
          <div className="absolute bottom-2 right-2 border-[4px] border-[var(--menu-border-color)] rounded-sm bg-[var(--menu-background)] w-full h-auto">
            {currentOptions.map((option, idx) => (
              <button
                key={idx}
                type="button"
                disabled={option.disabled}
                data-menu-button
                onClick={() => handleOptionSelect?.(option)}
                className={cx(
                  "text-4xl option hover:bg-orange-500 p-4 cursor-pointer w-full text-start",
                  idx === focusedIndex && "bg-orange-300",
                  option.disabled && "opacity-30"
                )}
              >
                {option.label} {option?.right}
              </button>
            ))}

            {history.length > 0 && (
              <button
                type="button"
                data-menu-button
                onClick={handleBack}
                className="text-4xl option bg-gray-200 hover:bg-orange-300 p-4 cursor-pointer w-full text-start"
              >
                ← Back
              </button>
            )}
          </div>
        </div>
      </div>
    </DialogContainer>
  );
};
