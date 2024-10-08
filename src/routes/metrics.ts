import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  getLeaderboard,
  getLeaderboardSchema,
} from "@/models/athlete/queries/getLeaderboard";

const metricsRouter = new Hono();

metricsRouter.get(
  "/leaderboard",
  zValidator("query", getLeaderboardSchema),
  async (c) => {
    const validated = c.req.valid("query");
    const leaderboard = await getLeaderboard(validated);
    return c.json(
      leaderboard as { id: string; name: string; average_value: number }[]
    );
  }
);

export default metricsRouter;
