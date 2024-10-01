import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import athletesRouter from "@/routes/athletes";
import metricsRouter from "@/routes/metrics";
import { authRouter } from "@/routes/auth";

const app = new Hono();
const prisma = new PrismaClient();

app.route("/athletes", athletesRouter);
app.route("/metrics", metricsRouter);
app.route("/auth", authRouter);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
export { prisma as db };
