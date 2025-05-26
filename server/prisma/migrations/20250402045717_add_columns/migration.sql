-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "encryptionKey" TEXT,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Journal" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "alternative" TEXT,
    "challenge" TEXT,
    "cognitiveDistortionIds" TEXT[],
    "belongsToId" TEXT NOT NULL,
    "cognitiveDistortionEmbedding" vector(1536),
    "contextEmbedding" vector(1536),

    CONSTRAINT "Journal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_username_key" ON "Player"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Player_email_key" ON "Player"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Player_encryptionKey_key" ON "Player"("encryptionKey");

-- AddForeignKey
ALTER TABLE "Journal" ADD CONSTRAINT "Journal_belongsToId_fkey" FOREIGN KEY ("belongsToId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
