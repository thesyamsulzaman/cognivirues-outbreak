import prisma from "../../src/libs/db";
import * as dotenv from "dotenv";
import resetDb from "../../src/helpers/reset-db";
import { hashPassword } from "../../src/utils/auth";
import { generateEncryptionKey } from "../../src/libs/encryption";

dotenv.config();

const main = async () => {
  await resetDb();

  const player = await prisma.player.create({
    data: {
      email: "player@cognivirues.outbreak",
      username: "Peter",
      password: await hashPassword(process.env.BETA_PLAYER_PASSWORD!),
      encryptionKey: generateEncryptionKey(),
    },
  });

  console.log({ player });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
