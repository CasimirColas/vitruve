import { db } from "@/index";
import { Athlete, MetricType, Prisma } from "@prisma/client";
//import { getLeaderboardRaw } from "@prisma/client/sql";
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
  // const leaderboard = await db.$queryRawTyped(
  //   getLeaderboardRaw(metricType, limit ? limit : 10)
  // );
  const leaderboard = await db.$queryRaw(
    Prisma.sql`SELECT 
      a.id,
      a.name,
      AVG(m.value) as average_value
    FROM 
      "Athlete" a
    JOIN 
      "Metric" m ON a.id = m."athleteId"
    WHERE 
      m."metricType"::text = ${metricType}
    GROUP BY 
      a.id, a.name
    ORDER BY 
      average_value DESC
    LIMIT ${limit ? limit : 10}`
  );
  return leaderboard;
}

export { getLeaderboard, getLeaderboardSchema, Leaderboard };
