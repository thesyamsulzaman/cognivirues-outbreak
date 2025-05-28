import {
  Direction,
  LevelThemes,
  PLACEMENT_TYPE_BOUND,
  PLACEMENT_TYPE_FLOUR,
  PLACEMENT_TYPE_GOAL,
  PLACEMENT_TYPE_HERO,
  PLACEMENT_TYPE_INFECTED,
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
import { noop } from "lodash";
import { Tile } from "@/utils/generate-background-tiles";
import { Disclosure } from "./disclosure";
import { GameEvent } from "./game-event";
import { TextMessage } from "./text-message";
import unionBy from "lodash/unionBy";
import { TILES } from "@/constants/tiles";
import { mergeByXY } from "@/utils/common";

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
  journals: any[];
  enemies: any;
  dialogs: any;
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
  battle: Battle | undefined;
  custscenes?: Array<{ type: string; text: string }>;
  clearCutscene: () => void;
  editMode?: EditModeType<typeof EditMode>;
  setEditMode?: (editMode) => void;
  editModePlacement: any;
  editModeTile: any | undefined;
  [properties: string]: any;
}

class LevelState {
  id: keyof typeof levels | undefined;
  onEmit: (data: any) => void;
  journals: any[];
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
  editModePlacement: any;
  editModeTile: any | undefined;
  editMode?: EditModeType<typeof EditMode>;
  manageJournalsScreen: Disclosure;
  cutScenes: Disclosure;
  textMessage: TextMessage | undefined;
  enemies: any;
  dialogs: any;

  constructor({
    levelId,
    onEmit,
    editMode,
    journals,
    enemies,
    dialogs,
  }: StateParams) {
    this.id = levelId;
    this.journals = journals;
    this.enemies = enemies;
    this.dialogs = dialogs;
    this.onEmit = onEmit;
    this.directionsControls = new DirectionControls();

    // Journal modal
    this.cutScenes = new Disclosure(false, {
      onOpen: () => {
        setTimeout(() => {
          this.gameLoop.pause();
        }, 500);
      },
      onClose: () => {
        this.gameLoop.continue();
      },
    });

    // Journal modal
    this.manageJournalsScreen = new Disclosure(false, {
      onOpen: () => {
        this.gameLoop.pause();
      },
      onClose: () => {
        this.gameLoop.continue();
      },
    });

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
    const placements = [...level.placements, ...this.enemies];
    const tiles = mergeByXY(level.tiles, this.dialogs);

    this.isCompleted = false;
    this.deathOutcome = null;

    this.theme = level.theme as LevelThemes;
    this.tilesWidth = level.tilesWidth;
    this.tilesHeight = level.tilesHeight;
    this.tiles = tiles;

    this.placements = placements?.map((config) =>
      placementFactory.createPlacement(config, this)
    );

    this.inventory = new Inventory();

    this.heroRef = this.placements.find(
      (placement) => placement.type === PLACEMENT_TYPE_HERO
    );

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

  async startCutScene(events: any[]) {
    this.cutScenes.open();

    for (const event of events) {
      const eventHandler = new GameEvent(this, event);
      await eventHandler.init();
    }

    this.cutScenes.close();
  }

  startGameLoop() {
    this.gameLoop?.stop();
    this.gameLoop = new GameLoop(
      () => {
        this.tick();
      },
      // Force render when hit pause
      () => {
        this.onEmit(this.getState());
      }
    );
  }

  addPlacement(config: any) {
    this.placements?.push(placementFactory.createPlacement(config, this));
  }

  updateJournals(journals: Array<any>) {
    this.journals = journals;
    this.onEmit(this.getState());
  }

  deleteDialog({ x, y }) {
    this.tiles = this.tiles?.map((tile) =>
      tile?.x === x && tile?.y === y ? { ...tile, cutscene: null } : tile
    );
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
      theme: this.theme,
      tilesHeight: this.tilesHeight,
      tilesWidth: this.tilesWidth,
      tiles: this.tiles,
      placements: this?.placements?.map((p) => ({
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

    // emit changes
    this.onEmit(this.getState());
  }

  isPositionOutOfBounds(x, y) {
    /**
     * The bound is any wall
     */
    // TODO
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
      restart: () => {
        this.start();
      },
      /**
       * Dialogs
       */
      dialogs: this.dialogs,
      deleteDialog: this.deleteDialog.bind(this),
      /**
       * Cut Scenes
       */
      cutScenes: this.cutScenes,
      startCutScene: this.startCutScene.bind(this),
      textMessage: this.textMessage,
      /**
       * JOURNAL MANAGEMENT
       */
      journals: this.journals,
      manageJournalsScreen: this.manageJournalsScreen,
      updateJournals: this.updateJournals.bind(this),
      /**
       * BATTLE MODE
       */
      battle: this.battle,
      heroRef: this?.heroRef,
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

    this?.inventory?.clear();
  }

  switchAllDoors() {
    this.placements?.forEach((placement) => {
      if (placement.toggleIsRaised) {
        placement.toggleIsRaised();
      }
    });
  }

  setDeathOutcome(causeOfDeath: any) {
    this.deathOutcome = causeOfDeath;

    if (this.gameLoop.isRunning) {
      this.gameLoop.stop();
    }
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
