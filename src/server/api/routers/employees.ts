import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const employeeInputSchema = z.object({
  name: z.string(),
  surname: z.string(),
  telephone: z.string(),
  email: z.string().email(),
  status: z.string(),
  managerId: z.string().optional(), // ?? Others have no manager
  departmentId: z.string(),
});

export const employeeRouter = createTRPCRouter({
  // Get unique
  getUnique: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.employee.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  // Edit Employee
  editEmployee: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        status: z.string(),
        surname: z.string(),
        telephone: z.string(),
        email: z.string().email(),
        managerId: z.string().optional(),
        departmentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.employee.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          status: input.status,
          surname: input.surname,
          telephone: input.telephone,
          email: input.email,
          departmentId: input.departmentId,
          managerId: input.managerId,
        },
      });
    }),

  // Delete employee
  deleteEmployee: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.db.employee.delete({
        where: {
          id: input.id,
        },
      });
    }),

  // Fetch All Employees Data
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.employee.findMany();
  }),

  // Create a new employee
  createNewEmployee: protectedProcedure
    .input(employeeInputSchema)
    .mutation(async ({ input, ctx }) => {
      const department = await ctx.db.department.findUnique({
        where: { id: input.departmentId },
      });

      if (!department) {
        throw new Error(`Department with ID ${input.departmentId} not found.`);
      }

      // If managerId is provided
      if (input.managerId) {
        const manager = await ctx.db.user.findUnique({
          where: { id: input.managerId },
        });

        if (!manager) {
          throw new Error(`Manager with ID ${input.managerId} not found.`);
        }
      }

      // Create the employee and link with department and manager (if provided)
      return await ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          role: "user",
          employee: {
            create: {
              name: input.name,
              surname: input.surname,
              telephone: input.telephone,
              email: input.email,
              status: input.status,
              department: {
                connect: { id: input.departmentId }, // Link the department
              },
            },
          },
        },
      });
    }),
});
