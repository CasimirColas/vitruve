import { db } from "@/index";

export default async function getAthlete(id: string) {
  const res = await db.athlete.findUnique({ where: { id: id } });
  return res;
}
