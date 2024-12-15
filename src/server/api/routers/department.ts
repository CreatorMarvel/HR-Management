import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const departmentRouter = createTRPCRouter({
  // created a new department
  createNewDep: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.db.department.create({
        data: {
          name: input.name,
        },
      });
    }),

  // get all department list
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.department.findMany();
  }),

  // edit department
  editDepartment: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        status: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.department.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          status: input.status,
        },
      });
    }),

  // find unique department
  getUnique: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const department = await ctx.db.department.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!department) {
        throw new Error("Department not found");
      }

      return department;
    }),

  // delete department
  deleteDep: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.department.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
