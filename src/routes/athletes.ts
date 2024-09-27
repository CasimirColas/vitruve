import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import {
  createAthleteSchema,
  createAthlete,
} from "@/models/athlete/mutations/createAthlete";
import {
  createMetric,
  createMetricSchema,
} from "@/models/metric/mutations/createMetric";
import getAthletes from "@/models/athlete/queries/getAthletes";
import getAthlete from "@/models/athlete/queries/getAthlete";
import { z } from "zod";
import {
  getAthleteMetrics,
  getAthleteMetricsSchema,
} from "@/models/metric/queries/getAthleteMetrics";
import {
  AggregateOperations,
  getAggregateSchema,
  getAggregate,
} from "@/models/metric/queries/getAggregate";
import { getTrend, getTrendSchema } from "@/models/metric/queries/getTrend";
import { updateAthlete } from "@/models/athlete/mutations/updateAthlete";
import deleteAthlete from "@/models/athlete/mutations/deleteAthlete";

const athletesRouter = new Hono();

// POST

athletesRouter.post("/", zValidator("json", createAthleteSchema), async (c) => {
  const validated = c.req.valid("json");
  const athlete = await createAthlete(validated);
  return c.json(athlete);
});

athletesRouter.post(
  "/:id/metrics",
  zValidator("param", z.object({ id: z.string().uuid() })),
  zValidator("json", createMetricSchema),
  async (c) => {
    const validated = c.req.valid("json");
    const metric = await createMetric({
      ...validated,
      athleteId: c.req.valid("param").id,
    });
    return c.json(metric);
  }
);

// GET

athletesRouter.get("/", async (c) => {
  const athletes = await getAthletes();
  return c.json(athletes);
});

athletesRouter.get(
  "/:id",
  zValidator("param", z.object({ id: z.string().uuid() })),
  async (c) => {
    const athlete = await getAthlete(c.req.valid("param").id);
    return c.json(athlete);
  }
);

athletesRouter.get(
  "/:id/metrics",
  zValidator("param", z.object({ id: z.string().uuid() })),
  zValidator("json", getAthleteMetricsSchema),
  async (c) => {
    const validated = c.req.valid("json");
    const metrics = await getAthleteMetrics({
      ...validated,
      id: c.req.valid("param").id,
    });
    return c.json(metrics);
  }
);

athletesRouter.get(
  "/:id/metrics/aggregate",
  zValidator("param", z.object({ id: z.string().uuid() })),
  zValidator("json", getAggregateSchema),
  async (c) => {
    const { metricType, operations, dateRange } = c.req.valid("json");
    // If standard deviation is requested, a date range is required
    if (!dateRange && operations.includes(AggregateOperations.stddev)) {
      throw new HTTPException(422, {
        message: "Date range is required for standard deviation calculations",
      });
    }
    const aggregate = await getAggregate({
      id: c.req.valid("param").id,
      metricType: metricType,
      operations: operations,
      dateRange: dateRange,
    });
    return c.json(aggregate);
  }
);

athletesRouter.get(
  "/:id/metrics/trends",
  zValidator("param", z.object({ id: z.string().uuid() })),
  zValidator("json", getTrendSchema),
  async (c) => {
    const validated = c.req.valid("json");
    const trend = await getTrend({
      ...validated,
      athleteId: c.req.valid("param").id,
    });
    return c.json(trend);
  }
);

// PUT

athletesRouter.put(
  "/:id",
  zValidator("param", z.object({ id: z.string().uuid() })),
  zValidator("json", createAthleteSchema),
  async (c) => {
    const validated = c.req.valid("json");
    const athlete = await updateAthlete({
      ...validated,
      id: c.req.valid("param").id,
    });
    return c.json(athlete);
  }
);

// DELETE

athletesRouter.delete(
  "/:id",
  zValidator("param", z.object({ id: z.string().uuid() })),
  async (c) => {
    const athlete = await deleteAthlete(c.req.valid("param").id);
    return c.json(athlete);
  }
);

export default athletesRouter;
