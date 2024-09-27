import { db } from "@/index";
import { Athlete } from "@prisma/client";

/**
 * Get an athlete by ID
 * @param {string} id The ID of the athlete to get
 * @returns {Athlete} The athlete with his metrics
 * */
export default async function getAthlete(id: string) {
  const res = await db.athlete.findUnique({ where: { id: id } });
  return res;
}
