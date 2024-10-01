import { MetricType, PrismaClient, Unit } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { subDays } from "date-fns";

const NUMBER_OF_ATHLETES = 10;

const prisma = new PrismaClient();

type TestMetric = {
  value: number;
  unit: Unit;
  metricType: MetricType;
  timestamp: Date;
};

function generateMetrics() {
  const today = new Date();
  // Add some randomness to the values
  function distinctValue(v: number) {
    return Math.round(v * (1 + Math.random() * 0.2));
  }
  const stamina: TestMetric[] = Array.from({ length: 10 }, (_, i) => {
    return {
      value: faker.number.float({ min: 0, max: 10, fractionDigits: 2 }),
      unit: Unit.KILOMETERS,
      metricType: MetricType.STAMINA,
      timestamp: subDays(today, i),
    };
  });
  const strength: TestMetric[] = [
    {
      value: distinctValue(60),
      unit: Unit.KILOGRAMS,
      metricType: MetricType.STRENGTH,
      timestamp: today,
    },
    {
      value: distinctValue(80),
      unit: Unit.KILOGRAMS,
      metricType: MetricType.STRENGTH,
      timestamp: subDays(today, 1),
    },
    {
      value: distinctValue(70),
      unit: Unit.KILOGRAMS,
      metricType: MetricType.STRENGTH,
      timestamp: subDays(today, 2),
    },
    {
      value: distinctValue(80),
      unit: Unit.KILOGRAMS,
      metricType: MetricType.STRENGTH,
      timestamp: subDays(today, 4),
    },
    {
      value: distinctValue(70),
      unit: Unit.KILOGRAMS,
      metricType: MetricType.STRENGTH,
      timestamp: subDays(today, 5),
    },
    {
      value: distinctValue(60),
      unit: Unit.KILOGRAMS,
      metricType: MetricType.STRENGTH,
      timestamp: subDays(today, 6),
    },
    {
      value: distinctValue(50),
      unit: Unit.KILOGRAMS,
      metricType: MetricType.STRENGTH,
      timestamp: subDays(today, 8),
    },
  ];
  const speed: TestMetric[] = [
    {
      value: distinctValue(15),
      unit: Unit.MPS,
      metricType: MetricType.SPEED,
      timestamp: today,
    },
    {
      value: distinctValue(12),
      unit: Unit.MPS,
      metricType: MetricType.SPEED,
      timestamp: subDays(today, 4),
    },
    {
      value: distinctValue(10),
      unit: Unit.MPS,
      metricType: MetricType.SPEED,
      timestamp: subDays(today, 8),
    },
  ];

  return stamina.concat(strength).concat(speed);
}

async function createNewAthlete() {
  const athlete = await prisma.athlete.create({
    data: {
      name: faker.person.firstName() + " " + faker.person.lastName(),
      age: faker.number.int({ min: 18, max: 40 }),
      team: Math.random() > 0.3 ? faker.animal.type() : null,
      metrics: { createMany: { data: generateMetrics() } },
    },
  });
  console.log("Athlete created: " + athlete.name);
}

async function seed() {
  console.log("Started seeding...");
  for await (const i of Array(NUMBER_OF_ATHLETES).keys()) {
    const athlete = await createNewAthlete();
  }
  console.log("Finished seeding");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
