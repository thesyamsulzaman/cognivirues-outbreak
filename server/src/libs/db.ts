// @ts-nocheck
import { PrismaClient } from "@prisma/client";
import { withPGVector } from "prisma-extension-pgvector";

const prismaClient = new PrismaClient().$extends(
  withPGVector({
    modelName: "journal",
    vectorFieldName: "embedding",
    idFieldName: "id",
  })
);

export default prismaClient;
