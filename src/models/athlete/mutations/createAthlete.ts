import { db } from "@/index";
import { z } from "zod";
import { Athlete } from "@prisma/client";

const createAthleteSchema = z.object({
  name: z.string(),
  age: z.number(),
  team: z.string().optional(),
});

interface CreateAthleteRequest {
  name: string;
  age: number;
  team?: string;
}

/**
 * Create a new athlete
 * @param {string} name The name of the athlete
 * @param {number} age The age of the athlete
 * @param {?string} team The team the athlete belongs to or not
 * @returns {Athlete} The created athlete
 * */
async function createAthlete(req: CreateAthleteRequest) {
  const res = await db.athlete.create({ data: req });
  return res;
}

export { createAthlete, createAthleteSchema, CreateAthleteRequest };
