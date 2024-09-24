import { Hono } from "hono";

const athletesRouter = new Hono();

// POST

/**
 * Create a new athlete
 * */
athletesRouter.post("/", (c) => {
  return c.json({ message: "Hello new Athlete!" });
});

/**
 * Add a new performance metric for a specific
 * */
athletesRouter.post("/:id/metrics", (c) => {
  return c.json({
    message: `Hello Athlete ${c.req.param("id")} with new Metric!`,
  });
});

// GET

/**
 * Retrieve a list of all athletes
 * */
athletesRouter.get("/", (c) => {
  return c.json({ message: "Hello Athletes!" });
});

/**
 * Get details and performance metrics for a specific athlete
 * @param {string} id The ID of the athlete to retrieve
 */
athletesRouter.get("/:id", (c) => {
  return c.json({ message: `Hello Athlete ${c.req.param("id")}!` });
});

/**
 * Retrieve the performance metrics for a specific athlete, with the option to filter by metricType and a date range
 * @param {string} id The ID of the athlete to retrieve metrics for
 * @param {string} metricType The type of metric to retrieve
 * @param {string} dateRange The date range to retrieve metrics for
 */
athletesRouter.get("/:id/metrics", (c) => {
  return c.json({ message: `Hello Athlete ${c.req.param("id")} Metrics!` });
});

/**
 * Retrieve aggregate statistics for an athlete’s performance metrics
 * @param {string} id The ID of the athlete to retrieve statistics for
 * @param {string} metricType The type of metric to retrieve statistics for
 * @param {string} operation The operation to perform on the metric values (average, max, min, total, stddev)
 */
athletesRouter.get("/:id/metrics/aggregate", (c) => {
  const { metricType, operation } = c.req.query();
  return c.json({
    message: `Hello Athlete ${c.req.param("id")}!`,
    operation: operation,
    metricType: metricType,
  });
});

/**
 * Retrieve the trend of an athlete’s performance metrics over time
 * @param {string} id The ID of the athlete to retrieve the trend for
 * @param {string} metricType The type of metric to retrieve the trend for
 * @param {string} dateRange The date range to retrieve the trend for
 */
athletesRouter.get("/:id/metrics/trends", (c) => {
  const { metricType, dateRange } = c.req.query();
  return c.json({
    message: `Hello Athlete ${c.req.param("id")}!`,
    metricType: metricType,
    dateRange: dateRange,
  });
});

// PUT

/**
 * Update an athlete’s details
 * @param {string} id The ID of the athlete to update
 */
athletesRouter.put("/:id", (c) => {
  return c.json({ message: `Hello updated Athlete ${c.req.param("id")}!` });
});

// DELETE

/**
 * Delete an athlete
 * @param {string} id The ID of the athlete to delete
 */
athletesRouter.delete("/:id", (c) => {
  return c.json({ message: `Hello deleted Athlete ${c.req.param("id")}!` });
});

export default athletesRouter;
