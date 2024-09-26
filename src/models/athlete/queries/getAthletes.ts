import { db } from "@/index";

export default async function getAthletes() {
  const res = await db.athlete.findMany();
  return res;
}
