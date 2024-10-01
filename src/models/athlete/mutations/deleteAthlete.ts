import { db } from "@/index";
import { Athlete } from "@prisma/client";
import { HTTPException } from "hono/http-exception";

/**
 * Delete an athlete
 * @param {string} id The ID of the athlete to delete
 * @returns {Athlete} The deleted athlete
 */
export default async function deleteAthlete(id: string) {
  const athlete = await db.athlete.findUnique({ where: { id: id } });
  if (!athlete) {
    throw new HTTPException(404, { message: "Athlete not found" });
  }
  const res = await db.athlete.delete({ where: { id: id } });
  return res;
}
