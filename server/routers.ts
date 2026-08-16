import { COOKIE_NAME } from "../shared/const.js";
import { z } from "zod";
import { consumePairing, createPairing, getPairing, submitPairing } from "./cloud-pairing";
import { searchSubtitles } from "./subtitles";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  subtitles: router({
    search: publicProcedure.input(z.object({
      title: z.string().min(1).max(200),
      year: z.number().int().min(1900).max(2100).optional(),
      season: z.number().int().min(1).max(99).optional(),
      episode: z.number().int().min(1).max(999).optional(),
      language: z.enum(["pt-br", "pt-pt", "en", "es"]).default("pt-br"),
    })).query(({ input }) => searchSubtitles(input)),
  }),

  cloud: router({
    createPairing: publicProcedure.mutation(() => {
      return createPairing();
    }),
    status: publicProcedure.input(z.object({ token: z.string().min(6).max(32) })).query(({ input }) => {
      const session = getPairing(input.token);
      if (!session) return { state: "expired" as const };
      if (!session.m3uUrl) return { state: "waiting" as const, expiresAt: session.expiresAt };
      return { state: "ready" as const, expiresAt: session.expiresAt, m3uUrl: session.m3uUrl, server: session.server, username: session.username, format: session.format };
    }),
    submitPairing: publicProcedure.input(z.object({
      token: z.string().min(6).max(32),
      m3uUrl: z.string().url().max(2048).optional(),
      server: z.string().max(512).optional(),
      username: z.string().max(256).optional(),
      password: z.string().max(256).optional(),
      format: z.string().max(64).optional(),
    })).mutation(({ input }) => {
      return submitPairing(input);
    }),
    consumePairing: publicProcedure.input(z.object({ token: z.string().min(6).max(32) })).mutation(({ input }) => {
      return consumePairing(input.token);
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
