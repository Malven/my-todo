-- CreateTable
CREATE TABLE "Pokemon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "spriteUrl" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL,
    "apiId" INTEGER NOT NULL
);
