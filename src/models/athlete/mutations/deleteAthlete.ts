import { db } from "@/index";
import { Athlete } from "@prisma/client";

/**
 * Delete an athlete
 * @param {string} id The ID of the athlete to delete
 * @returns {Athlete} The deleted athlete
 */
export default async function deleteAthlete(id: string) {
  const res = await db.athlete.delete({ where: { id: id } });
  return res;
}
