import { db } from "@/index";
import { Athlete } from "@prisma/client";
import { z } from "zod";
import { HTTPException } from "hono/http-exception";

// The id for the athlete will be provided through the request body
const UpdateAthleteSchema = z.object({
  name: z.string().optional(),
  age: z.number().optional(),
  team: z.string().optional().nullable(),
});
interface UpdateAthlete {
  id: string;
  name?: string;
  age?: number;
  team?: string | null;
}
/**
 * Update an athlete’s details
 * @param {string} id The ID of the athlete to update
 * @param {?string} name The name of the athlete
 * @param {?number} age The age of the athlete
 * @param {?string} team The team the athlete is part of
 * @returns {Athlete} The updated athlete
 */
async function updateAthlete(req: UpdateAthlete) {
  const athlete = await db.athlete.findUnique({ where: { id: req.id } });
  if (!athlete) {
    throw new HTTPException(404, { message: "Athlete not found" });
  }
  const res = await db.athlete.update({
    where: { id: req.id },
    data: {
      name: req.name,
      age: req.age,
      team: req.team,
    },
  });
  return res;
}

export { updateAthlete, UpdateAthleteSchema, UpdateAthlete };
