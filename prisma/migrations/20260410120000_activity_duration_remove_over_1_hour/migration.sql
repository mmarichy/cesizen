-- Map legacy enum value before shrinking ActivityDuration
UPDATE "Activity" SET "duration" = 'HOUR_1' WHERE "duration"::text = 'OVER_1_HOUR';

-- AlterEnum
BEGIN;
CREATE TYPE "ActivityDuration_new" AS ENUM ('MIN_15', 'MIN_30', 'MIN_45', 'HOUR_1');
ALTER TABLE "public"."Activity" ALTER COLUMN "duration" DROP DEFAULT;
ALTER TABLE "Activity" ALTER COLUMN "duration" TYPE "ActivityDuration_new" USING ("duration"::text::"ActivityDuration_new");
ALTER TYPE "ActivityDuration" RENAME TO "ActivityDuration_old";
ALTER TYPE "ActivityDuration_new" RENAME TO "ActivityDuration";
DROP TYPE "public"."ActivityDuration_old";
ALTER TABLE "Activity" ALTER COLUMN "duration" SET DEFAULT 'MIN_15';
COMMIT;
