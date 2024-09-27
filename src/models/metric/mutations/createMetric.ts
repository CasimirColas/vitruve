import { db } from "@/index";
import { Metric, MetricType, Unit } from "@prisma/client";
import { z } from "zod";

// The athleteId is provided through the request params
const createMetricSchema = z.object({
  metricType: z.nativeEnum(MetricType),
  unit: z.nativeEnum(Unit),
  value: z.number(),
  timestamp: z.date(),
});

interface CreateMetricRequest {
  athleteId: string;
  metricType: MetricType;
  unit: Unit;
  value: number;
  timestamp: Date;
}

/**
 * Add a new performance metric for a specific athlete
 * @param {string} athleteId The ID of the athlete to add the metric for
 * @param {MetricType} metricType The type of metric to add
 * @param {Unit} unit The unit of the metric
 * @param {number} value The value of the metric
 * @param {Date} timestamp The timestamp of the metric
 * @returns {Metric} The created metric
 * */
async function createMetric(req: CreateMetricRequest) {
  const res = await db.metric.create({ data: req });
  return res;
}

export { createMetric, createMetricSchema, CreateMetricRequest };
