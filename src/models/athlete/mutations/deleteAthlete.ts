import { db } from "@/index";

export default async function deleteAthlete(id: string) {
  const res = await db.athlete.delete({ where: { id: id } });
  return res;
}
