import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  // Get with Unique Email
  getUniqueWithEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(({ input, ctx }) => {
      return ctx.db.user.findUnique({
        where: {
          email: input.email,
        },
        include: { employee: true },
      });
    }),
});
