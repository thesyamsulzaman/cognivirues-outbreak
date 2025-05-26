import prisma from "../libs/db";

export default async () => {
  await prisma.$transaction([
    // prisma.player.deleteMany(),
    // prisma.inventory.deleteMany(),
    // prisma.update.deleteMany(),
    // prisma.updatePoint.deleteMany(),
  ]);
};
