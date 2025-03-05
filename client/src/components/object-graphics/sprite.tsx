"use client";
import { CELL_SIZE } from "@/constants/helpers";
import { useGame } from "@/contexts/game";
import { memo, useEffect, useRef } from "react";

const Sprite = ({
  frameCoordinate,
  size = 16,
}: {
  frameCoordinate: string;
  size?: number;
}) => {
  const { image } = useGame();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const ctx = canvasElement?.getContext("2d");

    /**
     * Clear out canvas element
     */
    ctx?.clearRect(0, 0, canvasElement?.width!, canvasElement?.height!);

    /**
     * Parse Coordinate, eg: 1x0, 2x0
     */
    const tileSheetX = Number(frameCoordinate.split("x")[0]);
    const tileSheetY = Number(frameCoordinate.split("x")[1]);

    /**
     * Drawing graphic to canvas tag
     */
    ctx?.drawImage(
      image as unknown as CanvasImageSource, // Image to pull from
      tileSheetX * CELL_SIZE, // Left X corner of frame
      tileSheetY * CELL_SIZE, // Top Y corner of frame
      size, //How much to crop from the sprite sheet (X)
      size, //How much to crop from the sprite sheet (Y)
      0, //Where to place this on canvas tag X (0)
      0, //Where to place this on canvas tag Y (0)
      size, //How large to scale it (X)
      size //How large to scale it (Y)
    );
  }, [frameCoordinate, image, size]);

  return <canvas height={size} width={size} ref={canvasRef!} />;
};

export default memo(Sprite);
