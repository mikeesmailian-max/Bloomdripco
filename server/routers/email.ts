import { publicProcedure, router } from "../_core/trpc";
import { sendBookingEmails, sendLeadWelcomeEmail, sendGenericEmail } from "../email";
import { z } from "zod";

export const emailRouter = router({
  /**
   * Submit a booking request — sends admin notification + client confirmation.
   */
  submitBooking: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        phone: z.string().min(1, "Phone is required"),
        email: z.string().email().optional().or(z.literal("")),
        service: z.string().min(1),
        date: z.string().min(1, "Date is required"),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await sendBookingEmails({
        name: input.name,
        phone: input.phone,
        email: input.email ?? "",
        service: input.service,
        date: input.date,
        notes: input.notes,
      });
      return { success: true } as const;
    }),

  /**
   * Capture a lead — sends BLOOM25 discount email to the prospect
   * and notifies admin.
   */
  captureLead: publicProcedure
    .input(
      z.object({
        name: z.string().optional().default(""),
        email: z.string().email("Valid email required"),
      })
    )
    .mutation(async ({ input }) => {
      await sendLeadWelcomeEmail({ name: input.name, email: input.email });
      return { success: true } as const;
    }),

  /**
   * Generic send for admin-initiated emails (campaigns, review requests, etc.).
   * Accepts one or more recipients.
   */
  sendEmail: publicProcedure
    .input(
      z.object({
        to: z.union([z.string().email(), z.array(z.string().email())]),
        subject: z.string().min(1),
        html: z.string().min(1),
        from: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await sendGenericEmail(input);
      return { success: true } as const;
    }),
});
