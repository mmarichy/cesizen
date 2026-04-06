-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "ActivityDuration" AS ENUM ('MIN_15', 'MIN_30', 'MIN_45', 'HOUR_1', 'OVER_1_HOUR');

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "difficulty" "DifficultyLevel" NOT NULL DEFAULT 'EASY',
ADD COLUMN     "duration" "ActivityDuration" NOT NULL DEFAULT 'MIN_15';
