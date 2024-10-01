# NodeJS, Hono, Prisma, Postgress - Backend

## Getting Started

Create a .ENV with the 2 requiered environment variables:

- DATABASE_URL: the url for your postgtes database
- JWT_SECRET: a random string of letters that will be used to encode authentification tokens

```
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
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

## Shortcommings

Unfortunately I couldn't make the project work in Docker
