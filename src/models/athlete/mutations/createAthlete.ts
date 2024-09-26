import { db } from "@/index";
import type { Prisma } from "@prisma/client";

export default async function createAthlete(
  req: Omit<Prisma.AthleteCreateInput, "id">
) {
  const res = await db.athlete.create({ data: req });
  return res;
}
