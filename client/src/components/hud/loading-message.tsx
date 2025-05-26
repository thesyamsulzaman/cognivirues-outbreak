import { Loader } from "@mantine/core";

const LoadingMessage = () => {
  return (
    <div className="outer-container absolute inset-0 z-[var(--ui-popup-z-index)] flex items-center justify-center bg-gray-900/80">
      <div className="popup-container relative flex flex-col justify-center items-center">
        <h1 className="text-3xl font-semibold">Please wait ...</h1>
        <Loader size="xl" type="dots" color="#8960AF" />
      </div>
    </div>
  );
};

export default LoadingMessage;
