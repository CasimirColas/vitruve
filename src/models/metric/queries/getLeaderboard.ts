import { db } from "@/index";
import { MetricType } from "@prisma/client";

interface Leaderboard {
  metricType: MetricType;
  limit: number;
}

export default async function getLeaderboard(req: Leaderboard) {
  const leaderboard = await db.metric.findMany({
    where: { metricType: req.metricType },
    take: req.limit,
    orderBy: { value: "desc" },
  });
  return leaderboard;
}
