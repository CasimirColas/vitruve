import { db } from "@/index";
import type { Prisma } from "@prisma/client";

export default async function createMetric(
  req: Omit<Prisma.MetricCreateInput, "id">
) {
  const res = await db.metric.create({ data: req });
  return res;
}
