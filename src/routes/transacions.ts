import { FastifyInstance } from "fastify";
import { z } from "zod";

import { knex } from "../database";
import crypto, { randomUUID } from "node:crypto";
import { checkIfSessionIdExists } from "../middlewares/check-session-id-exists";

export async function transactionRoutes(app: FastifyInstance) {
  //Para fazer o middleware global usa o addHook:
  app.addHook("preHandler", async (req, res) => {
    console.log(`[${req.method}] ${req.url}`);
  });

  app.get(
    "/",
    {
      preHandler: [checkIfSessionIdExists],
    },
    async (req, res) => {
      const { sessionId } = req.cookies;

      const transactions = await knex("transactions")
        .select()
        .where({ session_id: sessionId });

      return {
        transactions,
      };
    }
  );

  app.get(
    "/:id",
    {
      preHandler: [checkIfSessionIdExists],
    },
    async (req) => {
      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      });
      const { id } = getTransactionParamsSchema.parse(req.params);
      const { sessionId } = req.cookies;

      const transaction = await knex("transactions")
        .where({ id, session_id: sessionId })
        .first();

      return {
        transaction,
      };
    }
  );

  app.get(
    "/summary",
    {
      preHandler: [checkIfSessionIdExists],
    },
    async (req) => {
      const { sessionId } = req.cookies;

      const summary = await knex("transactions")
        .where({ session_id: sessionId })
        .sum("amount", { as: "amount" })
        .first();

      return { summary };
    }
  );

  app.post("/", async (req, res) => {
    //Cria o tipo de dados que devem ser recebidos do body
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });
    const { title, amount, type } = createTransactionBodySchema.parse(req.body);

    let sessionId = req.cookies.sessionId;
    if (!sessionId) {
      sessionId = randomUUID();

      res.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24, //1 dia
      });
    }

    await knex("transactions").insert({
      id: crypto.randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: sessionId,
    });

    return res.status(201).send();
  });
}
