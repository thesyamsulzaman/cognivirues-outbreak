import { DialogType, TextMessageDisplay } from "@/components/hud/dialog";
import Journal from "@/components/ui/journaling";
import OnboardingPopup from "@/components/ui/onboarding-popup";
import { CATCH_UP_DIALOGS, TUTORIAL_DIALOGS } from "@/constants/content";
import { useGame } from "@/contexts/game";
import useGetTittle from "@/hooks/queries/use-get-title";
import { Button } from "@mantine/core";
import { noop } from "lodash";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const MainMenu = () => {
  const navigate = useNavigate();
  const { isSuccess } = useGetTittle();
  const timeoutRef = useRef<any>(null);
  const { progressEntry } = useGame({});

  const [screen, setScreen] = useState("main-menu");
  const [announcerMessage, setAnnouncerMessage] = useState("");

  const MENU = [
    {
      id: "start-game",
      title: "Start Game",
      color: "blue",
      onClick: () => setScreen("onboarding"),
    },
    ...(progressEntry?.get("hasCompletedTutorial")
      ? [
          {
            id: "continue-game",
            title: "Continue Game",
            color: "blue",
            onClick: () => setScreen("catch-up"),
          },
        ]
      : []),
  ];

  useEffect(() => {
    if (announcerMessage) {
      timeoutRef.current = setTimeout(() => {
        setAnnouncerMessage("");
      }, 1500);
    }

    return () => {
      clearTimeout(timeoutRef?.current);
    };
  }, [announcerMessage]);

  return (
    <div
      className="w-full h-screen"
      style={{
        backgroundImage: `url(/bg-battle-grayish.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        imageRendering: "pixelated",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
        {screen === "main-menu" && (
          <div className="flex flex-col">
            {isSuccess && (
              <h1 className="text-8xl font-bold text-center mb-8">
                Cognivirues <br />{" "}
                <span className="text-red-500">Outbreak</span>
              </h1>
            )}

            <div className="flex flex-col space-y-4">
              {MENU.map((option) => (
                <Button
                  key={option.id}
                  onClick={option?.onClick}
                  size="lg"
                  color={option.color}
                >
                  {option?.title}
                </Button>
              ))}
            </div>
          </div>
        )}

        {(screen === "tutorial" || screen === "catch-up") && (
          <TextMessageDisplay
            onComplete={() => setScreen("journaling")}
            leftSection={
              <div className="w-1/5">
                <img
                  src="./character.png"
                  alt="Peter"
                  className="-mt-14 w-[300px]"
                />
              </div>
            }
            content={
              (screen === "catch-up"
                ? CATCH_UP_DIALOGS
                : TUTORIAL_DIALOGS) as DialogType
            }
          />
        )}

        {screen === "onboarding" && (
          <OnboardingPopup
            isOpen
            onClose={() => {
              progressEntry?.save({ hasCompletedTutorial: true });
              setScreen("tutorial");
            }}
          />
        )}

        {screen === "journaling" && (
          <Journal isOpen onClose={noop} onFinish={() => navigate("/game")} />
        )}
      </div>
    </div>
  );
};

export default MainMenu;
