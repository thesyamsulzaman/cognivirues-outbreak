import progressEntry from "@/classes/progress-entry";
import Dialog, { DialogType } from "@/components/hud/dialog";
import Journal from "@/components/ui/journal";
import OnboardingPopup from "@/components/ui/onboarding-popup";
import { TUTORIAL_DIALOGS } from "@/constants/dialogs";
import useGetTittle from "@/hooks/queries/use-get-title";

import { useEffect, useRef, useState } from "react";

const MainMenu = () => {
  // const navigate = useRouter();
  const { data } = useGetTittle();
  const timeoutRef = useRef<any>(null);

  const [screen, setScreen] = useState("main-menu");
  const [dialogs, setDialogs] = useState(TUTORIAL_DIALOGS);
  const [announcerMessage, setAnnouncerMessage] = useState("");

  const MENU = [
    {
      title: "Mulai Permainan",
      onClick: () => setScreen("onboarding-popup"),
    },
    // ...(progressEntry?.get()?.checkpoint
    //   ? [
    //       {
    //         title: "Lanjutkan Permainan",
    //         onClick: () => {
    //           journalEntry.hasWroteToday()
    //             ? // ? navigate.push("/game")
    //               null
    //             : setScreen("journaling");
    //         },
    //       },
    //     ]
    //   : []),
    { title: "Keluar Permainan", onClick: () => window.close() },
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
        backgroundImage: `url(/bg-menu.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        imageRendering: "pixelated",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
        {screen === "main-menu" && (
          <div className="flex flex-col">
            {data?.title && (
              <h1 className="text-8xl font-bold text-center mb-8">
                Cognivirues <br />{" "}
                <span className="text-red-500">Outbreak</span>
              </h1>
            )}

            {MENU.map((option, idx) => (
              <button
                key={idx}
                className="option flex items-center justify-center hover:bg-orange-500 p-4 rounded-md cursor-pointer bg-red-500 text-white text-2xl my-4"
                onClick={option?.onClick}
              >
                {option?.title}
              </button>
            ))}
          </div>
        )}

        {screen === "tutorial" && (
          <Dialog
            isOpen={!!dialogs.length}
            onClose={() => {}}
            onComplete={() => {
              if (dialogs.length === 1) {
                setScreen("journaling");
                progressEntry.save({ hasCompletedTutorial: true });
              }

              setDialogs(dialogs?.slice(1));
            }}
            leftSection={
              <div className="w-1/5">
                <img
                  src="https://img.itch.zone/aW1nLzExNzY3NzEyLnBuZw==/original/zOww4a.png"
                  alt="Ciabatta"
                  className="-mt-14 w-[300px]"
                />
              </div>
            }
            content={dialogs as DialogType}
          />
        )}

        {screen === "onboarding-popup" && (
          <OnboardingPopup isOpen onClose={() => setScreen("tutorial")} />
        )}

        {screen === "journaling" && (
          <Journal isOpen onClose={() => {}} onSave={() => {}} />
        )}
      </div>
    </div>
  );
};

export default MainMenu;
