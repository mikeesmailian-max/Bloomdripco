import { randomUUID } from "crypto";
import { z } from "zod";
import {
  addUnsubscribe,
  createBooking,
  getUnsubscribeByToken,
  isUnsubscribed,
  listBookings,
  listUnsubscribes,
  updateBookingStatus,
} from "../db";
import { sendBookingEmails, sendGenericEmail, sendLeadWelcomeEmail } from "../email";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

/** Build a per-recipient unsubscribe URL and ensure the token is persisted. */
async function getUnsubscribeUrl(email: string, origin: string): Promise<string> {
  const token = randomUUID();
  await addUnsubscribe(email, token);
  return `${origin}/unsubscribe?token=${token}`;
}

export const emailRouter = router({
  // ─── Booking submission ────────────────────────────────────────────────────
  /**
   * Submit a booking request.
   * Persists the booking to the DB, then sends admin notification + client confirmation.
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
      // Persist to DB
      await createBooking({
        name: input.name,
        phone: input.phone ?? "",
        email: input.email ?? "",
        service: input.service,
        preferredDate: input.date,
        notes: input.notes ?? "",
        status: "pending",
      });

      // Send emails
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

  // ─── Lead capture ──────────────────────────────────────────────────────────
  /**
   * Capture a lead — sends BLOOM25 discount email to the prospect and notifies admin.
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

  // ─── Generic send (admin campaigns / review requests) ─────────────────────
  /**
   * Generic send for admin-initiated emails.
   * Skips any recipient that has unsubscribed.
   */
  sendEmail: publicProcedure
    .input(
      z.object({
        to: z.union([z.string().email(), z.array(z.string().email())]),
        subject: z.string().min(1),
        html: z.string().min(1),
        from: z.string().optional(),
        /** Frontend origin (window.location.origin) used to build the unsubscribe URL. */
        origin: z.string().url().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const recipients = Array.isArray(input.to) ? input.to : [input.to];
      const origin = input.origin ?? "https://bloomdripco.com";

      let sent = 0;
      let skipped = 0;

      for (const addr of recipients) {
        const unsub = await isUnsubscribed(addr);
        if (unsub) { skipped++; continue; }

        // Generate a unique unsubscribe URL per recipient
        const unsubscribeUrl = await getUnsubscribeUrl(addr, origin);
        await sendGenericEmail({ ...input, to: addr, unsubscribeUrl });
        sent++;
      }

      return { success: true, skipped, sent } as const;
    }),

  // ─── Booking log (admin) ───────────────────────────────────────────────────
  /**
   * List all bookings, newest first. Admin only.
   */
  listBookings: publicProcedure.query(async () => {
    return listBookings();
  }),

  /**
   * Update a booking's status. Admin only.
   */
  updateBookingStatus: publicProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
      })
    )
    .mutation(async ({ input }) => {
      await updateBookingStatus(input.id, input.status);
      return { success: true } as const;
    }),

  // ─── Unsubscribe (public) ──────────────────────────────────────────────────
  /**
   * One-click unsubscribe via token embedded in marketing emails.
   * Public — no auth required.
   */
  unsubscribeByToken: publicProcedure
    .input(z.object({ token: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const record = await getUnsubscribeByToken(input.token);
      if (!record) {
        // Token not found — either already processed or invalid
        return { success: false, message: "Invalid or expired unsubscribe link." } as const;
      }
      // Already in the table (token matched) — nothing more to do
      return { success: true, email: record.email } as const;
    }),

  /**
   * Manually unsubscribe an email address (e.g., from the public unsubscribe form).
   */
  unsubscribeEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const token = randomUUID();
      await addUnsubscribe(input.email, token);
      return { success: true } as const;
    }),

  /**
   * List all unsubscribed emails. Admin only.
   */
  listUnsubscribes: publicProcedure.query(async () => {
    return listUnsubscribes();
  }),
});
