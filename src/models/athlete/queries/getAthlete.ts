import { db } from "@/index";
import { Athlete } from "@prisma/client";
import { HTTPException } from "hono/http-exception";

/**
 * Get an athlete by ID
 * @param {string} id The ID of the athlete to get
 * @returns {Athlete} The athlete with his metrics
 * */
export default async function getAthlete(id: string) {
  const res = await db.athlete.findUnique({
    where: { id: id },
    select: {
      id: true,
      name: true,
      age: true,
      team: true,
      metrics: true,
    },
  });
  if (!res) {
    throw new HTTPException(404, { message: "Athlete not found" });
  }
  return res;
}
