import { db } from "@/index";
import { Athlete, MetricType } from "@prisma/client";
import { getLeaderboardRaw } from "@prisma/client/sql";
import { z } from "zod";

const getLeaderboardSchema = z.object({
  metricType: z.nativeEnum(MetricType),
  limit: z.coerce.number().optional(),
});
interface Leaderboard {
  metricType: MetricType;
  limit?: number;
}
/**
 * Retrieve a leaderboard of athletes ranked by the highest average value for a specified metric type
 * @param {string} metricType The type of metric to rank athletes by
 * @param {string} limit The maximum number of athletes to return
 * @returns {Athlete[]} The leaderboard of athletes
 */
async function getLeaderboard(req: Leaderboard) {
  const { metricType, limit } = req;
  const leaderboard = await db.$queryRawTyped(
    getLeaderboardRaw(metricType, limit ? limit : 10)
  );
  return leaderboard;
}

export { getLeaderboard, getLeaderboardSchema, Leaderboard };
