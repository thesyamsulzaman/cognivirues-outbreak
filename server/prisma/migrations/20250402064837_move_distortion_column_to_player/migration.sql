/*
  Warnings:

  - You are about to drop the column `cognitiveDistortionEmbedding` on the `Journal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Journal" DROP COLUMN "cognitiveDistortionEmbedding";

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "cognitiveDistortionEmbedding" vector(1536);
