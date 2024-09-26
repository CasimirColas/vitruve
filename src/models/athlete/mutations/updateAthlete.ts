import { db } from "@/index";
interface UpdateAthlete {
  id: string;
  name?: string;
  age?: number;
  team?: string;
}

export default async function updateAthlete(req: UpdateAthlete) {
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
