import {
  Direction,
  LevelThemes,
  PLACEMENT_TYPE_BOUND,
  PLACEMENT_TYPE_FLOUR,
  PLACEMENT_TYPE_GOAL,
  PLACEMENT_TYPE_HERO,
  PLACEMENT_TYPE_INFECTED_HERO,
  PLACEMENT_TYPE_ROAMING_ENEMY,
  PLACEMENT_TYPE_WALL,
  THEME_TILES_MAP,
} from "@/constants/helpers";
import placementFactory from "./placement-factory";
import { GameLoop } from "./game-loop";
import { DirectionControls } from "./direction-controls";
import levels from "../levels/levels-map";
import { Inventory } from "./inventory";
import { LevelAnimatedFrames } from "./level-animated-frame";
import { Camera } from "./camera";
import soundManager, { SFX } from "./sounds";
import { Battle } from "./battle";
import { DialogEvent } from "./dialog-event";
import progressEntry from "./progress-entry";
import { noop } from "lodash";
import generateBackgroundTiles, {
  Tile,
} from "@/utils/generate-background-tiles";

interface Placement {
  id: number;
  x: number;
  y: number;
  frameCoordinate: string;
}

export const EditMode = {
  NONE: "none",
  PLACEMENT: "placement",
  MAP: "map",
};

export type EditModeType<EditMode> = EditMode[keyof EditMode];

interface StateParams {
  levelId: keyof typeof levels;
  editMode?: EditModeType<typeof EditMode>;
  onEmit: (data: any) => void;
}

export interface LevelStateData {
  theme: LevelThemes;
  tilesWidth: number;
  tilesHeight: number;
  tiles: Array<Tile>;
  placements: Placement[];
  isCompleted: boolean;
  deathOutcome: any;
  cameraTransformX: string;
  cameraTransformY: string;
  inventory: any;
  heroRef?: any;
  battle?: any;
  custscenes?: Array<{ type: string; text: string }>;
  clearCutscene: () => void;
  restart: () => void;
  editMode?: EditModeType<typeof EditMode>;
  setEditMode?: (editMode) => void;
  editModePlacement: string;
  editModeTile: any | undefined;
  [properties: string]: any;
}

class LevelState {
  id: keyof typeof levels | undefined;
  onEmit: (data: any) => void;
  directionsControls: DirectionControls;
  theme: LevelThemes | undefined;
  tilesWidth: number | undefined;
  tilesHeight: number | undefined;
  tiles: Array<Tile> | undefined;
  placements: any[] | undefined;
  heroRef: any;
  gameLoop: any;
  isCompleted: boolean | undefined;
  levelId: keyof typeof levels | undefined;
  inventory: Inventory | undefined;
  deathOutcome: any;
  animatedFrames: LevelAnimatedFrames | undefined;
  camera: Camera | undefined;
  battle: Battle | undefined;
  cutscenes: Array<{ type: string; text: string }> | undefined;
  editModePlacement: any;
  editModeTile: any | undefined;
  editMode?: EditModeType<typeof EditMode>;

  constructor({ levelId, onEmit, editMode }: StateParams) {
    this.id = levelId;
    this.onEmit = onEmit;
    this.directionsControls = new DirectionControls();
    // this.tiles = [];

    /**
     * EDIT MODE
     */
    this.editMode = editMode;
    this.editModePlacement = { type: PLACEMENT_TYPE_WALL };
    this.editModeTile = {
      type: PLACEMENT_TYPE_BOUND,
      direction: Direction.Left,
    };

    this.start();
  }

  start(): void {
    const level = levels[this.id!];

    this.isCompleted = false;
    this.deathOutcome = null;

    this.theme = level.theme;
    this.tilesWidth = level.tilesWidth;
    this.tilesHeight = level.tilesHeight;
    this.tiles = level.tiles;

    if (this.editMode !== EditMode.NONE) {
      this.tiles = generateBackgroundTiles({
        theme: level.theme,
        tilesHeight: level.tilesHeight,
        tilesWidth: level.tilesWidth,
      });
    }
    // this.tiles = level.tiles;

    this.placements = level.placements?.map((config) =>
      placementFactory.createPlacement(config, this)
    );

    this.inventory = new Inventory();
    this.cutscenes = [];

    this.heroRef = this.placements.find(
      (placement) => placement.type === PLACEMENT_TYPE_HERO
    );

    /**
     * Create a battle
     */
    this.battle = new Battle();

    /**
     * Create a camera
     */
    this.camera = new Camera(this);

    /**
     * Create a frame animation manager
     */
    this.animatedFrames = new LevelAnimatedFrames();

    this.startGameLoop();
  }

  startGameLoop() {
    this.gameLoop?.stop();
    this.gameLoop = new GameLoop(() => {
      this.tick();
    });
  }

  addPlacement(config: any) {
    this.placements?.push(placementFactory.createPlacement(config, this));
  }

  replaceTile(newTile: Tile) {
    const updateTiles = (tile) => {
      return tile.x === newTile.x && tile.y === newTile.y ? newTile : tile;
    };

    this.tiles = this.tiles?.map(updateTiles);
  }

  deletePlacement(placementToRemove: any) {
    this.placements = this.placements?.filter((placement) => {
      return placement?.id !== placementToRemove?.id;
    });
  }

  setEditMode(editMode) {
    this.editMode = editMode;
  }

  setEditModePlacementType(newType) {
    this.editModePlacement = newType;
  }

  setEditModeTile(newType) {
    this.editModeTile = newType;
  }

  copyPlacementsToClipboard() {
    const level = {
      tilesHeight: this.tilesHeight,
      tilesWidth: this.tilesWidth,
      tiles: this.tiles,
      placements: this?.placements.map((p) => ({
        type: p.type,
        x: p.x,
        y: p.y,
        ...(p.direction && { direction: p.direction }),
        ...(p.color && { color: p.color }),
      })),
    };

    // Copy the data to the clipboard for moving into map files after editing
    navigator.clipboard.writeText(JSON.stringify(level)).then(
      () => {
        console.log("Content copied to clipboard");

        // Also console log the output
        console.log(level);
      },
      () => {
        console.error("Failed to copy");
      }
    );
  }

  tick() {
    if (this.directionsControls.direction) {
      this.heroRef.controllerMoveRequested(this.directionsControls.direction);
    }

    // Work on animation frames
    this.animatedFrames?.tick();

    this?.placements?.forEach((placement) => {
      placement.tick();
    });

    this?.camera?.tick();

    // // emit changes
    this.onEmit(this.getState());
  }

  forceRender() {
    this.onEmit(this.getState());
  }

  isPositionOutOfBounds(x, y) {
    /**
     * The bound is any wall
     */
    /**
     * The bound is the outer edge
     */
    // return (
    //   x === 0 ||
    //   y === 0 ||
    //   x >= this.tilesWidth! + 1 ||
    //   y >= this.tilesHeight! + 1
    // );
  }

  getState(): LevelStateData {
    return {
      theme: this.theme!,
      tilesWidth: this.tilesWidth!,
      tilesHeight: this.tilesHeight!,
      tiles: this.tiles!,
      placements: this.placements!,
      isCompleted: this.isCompleted!,
      deathOutcome: this.deathOutcome,
      cameraTransformX: this?.camera?.transformX!,
      cameraTransformY: this?.camera?.transformY!,
      inventory: this.inventory,

      /**
       * BATTLE CUSTOMIZATION
       */
      heroRef: this?.heroRef,
      custscenes: this.cutscenes,
      clearCutscene: () => this.clearCutscene(),
      battle: {
        instance: this?.battle,
        isOpen: this.battle?.isOpen || false,
        onComplete: (winner: any) => this.onBattleCompleted(winner),
      },
      restart: () => {
        this.start();
      },

      /**
       * Editing Mode
       */
      editMode: this.editMode,
      setEditMode: this.setEditMode.bind(this),
      copyPlacementsToClipboard: this.copyPlacementsToClipboard.bind(this),
      /**
       * Placement Editing
       */
      editModePlacement: this.editModePlacement,
      setEditModePlacementType: this.setEditModePlacementType.bind(this),
      addPlacement: this.addPlacement.bind(this),
      deletePlacement: this.deletePlacement.bind(this),
      /**
       * Map Editing
       */
      editModeTile: this.editModeTile,
      setEditModeTile: this.setEditModeTile.bind(this),
      replaceTile: this.replaceTile.bind(this),
    };
  }

  stealInventory() {
    this.placements?.forEach((placement) => {
      placement?.resetHasBeenCollected();
    });

    this.inventory.clear();
  }

  switchAllDoors() {
    this.placements?.forEach((placement) => {
      if (placement.toggleIsRaised) {
        placement.toggleIsRaised();
      }
    });
  }

  addCutscene(cutscenes) {
    this.cutscenes = cutscenes;
    this.gameLoop?.pause();
  }

  clearCutscene() {
    this.cutscenes = [];
    this.forceRender();
  }

  initializeBattle({ player, opponent }) {
    this.gameLoop?.pause();
    this.battle?.init({ player, opponent });
  }

  onBattleCompleted(result) {
    if (result?.opponent?.health === 0) {
      this.battle?.stop();
      this.battle?.combatans?.opponent?.defeated();
      this.heroRef.stats = result?.player;

      progressEntry.save({ stats: result?.player });
      this.gameLoop.continue();
    }

    if (result?.player?.health === 0) {
      this.battle?.stop();
      progressEntry.reset();

      this.setDeathOutcome(PLACEMENT_TYPE_INFECTED_HERO);
      soundManager.playSFX(SFX.GAME_OVER);
      this.forceRender();
    }
  }

  setDeathOutcome(causeOfDeath: any) {
    this.deathOutcome = causeOfDeath;
    this.gameLoop.stop();
  }

  completeLevel() {
    this.isCompleted = true;
    this.gameLoop.stop();
  }

  destroy(): void {
    this.gameLoop?.stop();
    this.directionsControls?.unbind();
  }
}

export default LevelState;
