import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  getLeaderboard,
  getLeaderboardSchema,
} from "@/models/metric/queries/getLeaderboard";

const metricsRouter = new Hono();

metricsRouter.get(
  "/leaderboard",
  zValidator("query", getLeaderboardSchema),
  async (c) => {
    const validated = c.req.valid("query");
    const leaderboard = await getLeaderboard(validated);
    return c.json(leaderboard);
  }
);

export default metricsRouter;
