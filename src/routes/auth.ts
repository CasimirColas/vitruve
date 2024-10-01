import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { sign as jwtSign, verify as jwtVerify } from "hono/jwt";
import { bearerAuth } from "hono/bearer-auth";
import { z } from "zod";

const authRouter = new Hono();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret || jwtSecret === "") {
  throw new Error("JWT_SECRET is not defined");
}

const isLoggedIn = bearerAuth({
  verifyToken: async (token, c) => {
    const check = await jwtVerify(token, jwtSecret)
      .then(() => true)
      .catch(() => false);
    return check;
  },
});

authRouter.post(
  "/login",
  zValidator("json", z.object({ email: z.string().email() })),
  async (c) => {
    const { email } = c.req.valid("json");
    const token = await jwtSign(
      { email, exp: Math.floor(Date.now() / 1000) + 60 * 5 }, // Token expires in 5 minutes
      jwtSecret
    );
    return c.json({ message: "Login successful", email, token });
  }
);

export { authRouter, isLoggedIn };
