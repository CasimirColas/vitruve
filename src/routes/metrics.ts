import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  getLeaderboard,
  getLeaderboardSchema,
} from "@/models/metric/queries/getLeaderboard";

const metricsRouter = new Hono();

metricsRouter.get(
  "/leaderboard",
  zValidator("json", getLeaderboardSchema),
  (c) => {
    const validated = c.req.valid("json");
    const leaderboard = getLeaderboard(validated);
    return c.json(leaderboard);
  }
);

export default metricsRouter;
