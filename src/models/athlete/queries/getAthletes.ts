import { db } from "@/index";
import { Athlete } from "@prisma/client";

/**
 * Get all athletes
 *
 * @returns {Athlete[]} All athletes in the database
 * */
export default async function getAthletes() {
  const res = await db.athlete.findMany();
  return res;
}
