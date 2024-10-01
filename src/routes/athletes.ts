import { Hono } from "hono";
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
  getAggregateSchema,
  getAggregate,
} from "@/models/metric/queries/getAggregate";
import { getTrend, getTrendSchema } from "@/models/metric/queries/getTrend";
import {
  updateAthlete,
  UpdateAthleteSchema,
} from "@/models/athlete/mutations/updateAthlete";
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
    const { metricType, unit, timestamp, value } = c.req.valid("json");
    const metric = await createMetric({
      metricType,
      unit,
      timestamp: new Date(timestamp),
      value,
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
  zValidator("query", getAthleteMetricsSchema),
  async (c) => {
    let { metricTypes, start, end } = c.req.valid("query");
    // If only one metricType is given in the query
    if (typeof metricTypes === "string") {
      metricTypes = [metricTypes];
    }
    const metrics = await getAthleteMetrics({
      id: c.req.valid("param").id,
      metricTypes: metricTypes,
      dateRange: {
        start: start ? new Date(start) : undefined,
        end: end ? new Date(end) : undefined,
      },
    });
    return c.json(metrics);
  }
);

athletesRouter.get(
  "/:id/metrics/aggregate",
  zValidator("param", z.object({ id: z.string().uuid() })),
  zValidator("query", getAggregateSchema),
  async (c) => {
    let { metricType, operations, start, end } = c.req.valid("query");
    // If only one operation is given in the query
    if (typeof operations === "string") {
      operations = [operations];
    }
    const aggregate = await getAggregate({
      id: c.req.valid("param").id,
      metricType: metricType,
      operations: operations,
      dateRange: {
        start: start ? new Date(start) : undefined,
        end: end ? new Date(end) : undefined,
      },
    });
    return c.json(aggregate);
  }
);

athletesRouter.get(
  "/:id/metrics/trends",
  zValidator("param", z.object({ id: z.string().uuid() })),
  zValidator("query", getTrendSchema),
  async (c) => {
    const { metricType, start, end } = c.req.valid("query");
    const trend = await getTrend({
      metricType: metricType,
      dateRange: {
        start: new Date(start),
        end: new Date(end),
      },
      athleteId: c.req.valid("param").id,
    });
    return c.json(trend);
  }
);

// PUT

athletesRouter.put(
  "/:id",
  zValidator("param", z.object({ id: z.string().uuid() })),
  zValidator("json", UpdateAthleteSchema),
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
