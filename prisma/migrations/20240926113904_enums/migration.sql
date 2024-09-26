/*
  Warnings:

  - Changed the type of `metricType` on the `Metric` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `unit` on the `Metric` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MetricType" AS ENUM ('SPEED', 'STRENGTH', 'STAMINA');

-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('KILOGRAMS', 'MPS', 'KILOMETERS');

-- AlterTable
ALTER TABLE "Metric" DROP COLUMN "metricType",
ADD COLUMN     "metricType" "MetricType" NOT NULL,
DROP COLUMN "unit",
ADD COLUMN     "unit" "Unit" NOT NULL;
