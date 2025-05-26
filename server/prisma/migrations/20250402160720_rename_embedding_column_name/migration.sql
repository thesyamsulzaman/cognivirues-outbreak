/*
  Warnings:

  - You are about to drop the column `contextEmbedding` on the `Journal` table. All the data in the column will be lost.
  - You are about to drop the column `cognitiveDistortionEmbedding` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Journal" DROP COLUMN "contextEmbedding",
ADD COLUMN     "embedding" vector(1536);

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "cognitiveDistortionEmbedding";
