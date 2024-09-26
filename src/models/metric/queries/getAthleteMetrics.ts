import { db } from "@/index";

export default async function getAthleteMetrics(id: string) {
  const metrics = await db.metric.findMany({ where: { athleteId: id } });
  return metrics;
}
