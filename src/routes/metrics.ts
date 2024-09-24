import { Hono } from "hono";

const metricsRouter = new Hono();

/**
 * Retrieve a leaderboard of athletes ranked by the highest average value for a specified metric type
 * @param {string} metricType The type of metric to rank athletes by
 * @param {string} limit The maximum number of athletes to return
 */
metricsRouter.get("/leaderboard", (c) => {
  const { metricType, limit } = c.req.query();
  return c.json({
    message: `Hello Leaderboard!`,
    metricType: metricType,
    limit: limit,
  });
});

export default metricsRouter;
