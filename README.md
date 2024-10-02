# NodeJS, Hono, Prisma, Postgress - Backend

## Getting Started

Create a .ENV with the 5 requiered environment variables:

```
POSTGRES_USER = "johndoe"
POSTGRES_PASSWORD = "randompassword"
POSTGRES_DB = "mydb"
DATABASE_URL="postgresql://johndoe:randompassword@db:5432/mydb?schema=public"
JWT_SECRET="your-secret"
```

Then execute the following commands in order

```
npm install
npx prisma generate --sql
npx prisma db push
```

You can also populate your database with the given seeding script by using

```
npx prisma db seed
```

Then start the project with

```
npm run dev
```

The server should be running on port 3000

## Docker

When using a docker container run

```
npx prisma db push
npx prisma db seed
```

To create and populate the database for testing

## Structure

```
vitruve
├───prisma
│   └───sql
└───src
    ├───models
    │   ├───athlete
    │   │   ├───mutations
    │   │   └───queries
    │   └───metric
    │       ├───mutations
    │       └───queries
    ├───routes
    |   ├───athletes.ts
    |   ├───auth.ts
    |   └───metrics.ts
    └───index.ts

```

## API Endpoints

The project provides the following endpoints:

- GET:
  - /athletes
  - /athletes/:id
  - /athletes/:id/metrics
  - /athletes/:id/metrics/aggregate
  - /athletes/:id/trends
  - /metrics/leaderboard
- POST:
  - /athletes
  - /athletes/:id
  - /auth/login
- PUT:
  - /athletes/:id
- DELETE:
  - /athletes/:id
