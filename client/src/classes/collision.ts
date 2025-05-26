import { PLACEMENT_TYPE_ICE } from "@/constants/helpers";

export class Collision {
  placementsAtPosition: any[];
  tilesAtPosition: any[];

  forBody: any;
  level: any;
  x: any;
  y: any;

  constructor(forBody: any, level: any, position: any = null) {
    this.forBody = forBody;
    this.level = level;
    this.placementsAtPosition = [];
    this.tilesAtPosition = [];
    this.x = position ? position.x : forBody.x;
    this.y = position ? position.y : forBody.y;
    this.scanPlacementsAtPosition();
  }

  scanPlacementsAtPosition() {
    this.placementsAtPosition = this.level.placements.filter(
      (placement: any) => {
        const isSelf = placement?.id === this.forBody.id;
        return !isSelf && placement.x === this.x && placement.y === this.y;
      }
    );

    this.tilesAtPosition = this.level.tiles.filter((tile: any) => {
      const isSelf = tile?.id === this.forBody.id;
      return !isSelf && tile.x === this.x && tile.y === this.y;
    });
  }

  withSolidPlacement() {
    return this.placementsAtPosition.find((placement) =>
      placement?.isSolidForBody(this.forBody)
    );
  }

  withPlacementsAddsToInventory() {
    if (this.forBody.canCollectItem) {
      return this.placementsAtPosition.find((placement) => {
        return (
          !placement.hasBeenCollected &&
          placement.addsItemToInventoryOnCollide(this.forBody)
        );
      });
    }

    return null;
  }

  withGetDialog() {
    if (this.forBody.canTriggerDialog) {
      return this.tilesAtPosition.find((tile) => tile?.cutscene);
    }

    return null;
  }

  withActivateBattleScreen() {
    if (this.forBody.canStartBattle) {
      return this.placementsAtPosition.find((placement) =>
        placement?.isFacingEachOther(this.forBody)
      );
    }

    return null;
  }

  withCompletesLevel() {
    if (this.forBody.canCompleteLevel) {
      return this.placementsAtPosition.find((placement) =>
        placement.completesLevelOnCollide()
      );
    }
    return null;
  }

  withLock() {
    return this.placementsAtPosition.find((placement) =>
      placement.canBeUnlocked()
    );
  }

  withSelfGetDamaged() {
    return this.placementsAtPosition.find((placement) =>
      placement.damagesBodyOnCollide(this.forBody)
    );
  }

  withChangesHeroSkin() {
    return this.placementsAtPosition.find((placement) =>
      placement.changesHeroSkinOnCollide(this.forBody)
    );
  }

  withPlacementMovesBody() {
    if (this.forBody.interactWithGround) {
      return this.placementsAtPosition.find((placement) =>
        placement.autoMovesBodyOnCollide(this.forBody)
      );
    }
    return null;
  }

  withIceCorner() {
    return this.placementsAtPosition.find(
      (placement) => placement.type === PLACEMENT_TYPE_ICE && placement.corner
    );
  }

  withDoorSwitch() {
    return this.placementsAtPosition.find((placement) =>
      placement.switchesDoorsOnCollide(this.forBody)
    );
  }

  withTeleport() {
    return this.placementsAtPosition.find((placement) => {
      const teleportPosition = placement.teleportsToPositionOnCollide(
        this.forBody
      );

      return Boolean(teleportPosition);
    });
  }

  withStealsInventory() {
    return this.placementsAtPosition.find((placement) =>
      placement?.stealsInventoryOnCollide(this.forBody)
    );
  }
}
