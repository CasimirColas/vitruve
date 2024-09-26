import { db } from "@/index";

export default async function deleteMetric(id: string) {
  const res = await db.metric.delete({ where: { id: id } });
  return res;
}
