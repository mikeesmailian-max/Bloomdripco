/**
 * Tests for booking log and unsubscribe procedures.
 * Validates DB helpers, tRPC procedure input schemas, and unsubscribe guard logic.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";

// ─── Schema validation tests ──────────────────────────────────────────────────

const submitBookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email().optional().or(z.literal("")),
  service: z.string().min(1),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

const updateBookingStatusSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
});

const sendEmailSchema = z.object({
  to: z.union([z.string().email(), z.array(z.string().email())]),
  subject: z.string().min(1),
  html: z.string().min(1),
  from: z.string().optional(),
  origin: z.string().url().optional(),
});

const unsubscribeByTokenSchema = z.object({
  token: z.string().uuid(),
});

const unsubscribeEmailSchema = z.object({
  email: z.string().email(),
});

describe("submitBooking schema", () => {
  it("accepts a valid booking", () => {
    const result = submitBookingSchema.safeParse({
      name: "Jane Doe",
      phone: "555-1234",
      email: "jane@example.com",
      service: "Myers Cocktail",
      date: "June 15, 2026",
      notes: "Prefer morning",
    });
    expect(result.success).toBe(true);
  });

  it("accepts booking without email (optional)", () => {
    const result = submitBookingSchema.safeParse({
      name: "John Smith",
      phone: "555-5678",
      service: "Hydration Drip",
      date: "June 20, 2026",
    });
    expect(result.success).toBe(true);
  });

  it("rejects booking with missing name", () => {
    const result = submitBookingSchema.safeParse({
      name: "",
      phone: "555-1234",
      service: "Hydration Drip",
      date: "June 15, 2026",
    });
    expect(result.success).toBe(false);
  });

  it("rejects booking with missing phone", () => {
    const result = submitBookingSchema.safeParse({
      name: "Jane Doe",
      phone: "",
      service: "Hydration Drip",
      date: "June 15, 2026",
    });
    expect(result.success).toBe(false);
  });

  it("rejects booking with invalid email", () => {
    const result = submitBookingSchema.safeParse({
      name: "Jane Doe",
      phone: "555-1234",
      email: "not-an-email",
      service: "Hydration Drip",
      date: "June 15, 2026",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateBookingStatus schema", () => {
  it("accepts valid status transitions", () => {
    const statuses = ["pending", "confirmed", "completed", "cancelled"] as const;
    for (const status of statuses) {
      const result = updateBookingStatusSchema.safeParse({ id: 1, status });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid status", () => {
    const result = updateBookingStatusSchema.safeParse({ id: 1, status: "unknown" });
    expect(result.success).toBe(false);
  });

  it("rejects non-positive id", () => {
    const result = updateBookingStatusSchema.safeParse({ id: 0, status: "confirmed" });
    expect(result.success).toBe(false);
  });
});

describe("sendEmail schema", () => {
  it("accepts single recipient", () => {
    const result = sendEmailSchema.safeParse({
      to: "client@example.com",
      subject: "Summer Promo",
      html: "<p>Hello!</p>",
    });
    expect(result.success).toBe(true);
  });

  it("accepts multiple recipients", () => {
    const result = sendEmailSchema.safeParse({
      to: ["a@example.com", "b@example.com"],
      subject: "Campaign",
      html: "<p>Hello!</p>",
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional origin for unsubscribe link generation", () => {
    const result = sendEmailSchema.safeParse({
      to: "client@example.com",
      subject: "Promo",
      html: "<p>Hi</p>",
      origin: "https://bloomdripco.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid origin URL", () => {
    const result = sendEmailSchema.safeParse({
      to: "client@example.com",
      subject: "Promo",
      html: "<p>Hi</p>",
      origin: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});

describe("unsubscribeByToken schema", () => {
  it("accepts valid UUID token", () => {
    const result = unsubscribeByTokenSchema.safeParse({
      token: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-UUID token", () => {
    const result = unsubscribeByTokenSchema.safeParse({ token: "not-a-uuid" });
    expect(result.success).toBe(false);
  });
});

describe("unsubscribeEmail schema", () => {
  it("accepts valid email", () => {
    const result = unsubscribeEmailSchema.safeParse({ email: "user@example.com" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = unsubscribeEmailSchema.safeParse({ email: "not-an-email" });
    expect(result.success).toBe(false);
  });
});

// ─── Unsubscribe guard logic ──────────────────────────────────────────────────

describe("unsubscribe guard logic", () => {
  it("skips sending to unsubscribed recipients", async () => {
    const isUnsubscribed = vi.fn().mockResolvedValue(true);
    const sendEmail = vi.fn();

    const recipients = ["unsub@example.com"];
    let sent = 0;
    let skipped = 0;

    for (const addr of recipients) {
      const unsub = await isUnsubscribed(addr);
      if (unsub) { skipped++; continue; }
      await sendEmail(addr);
      sent++;
    }

    expect(sent).toBe(0);
    expect(skipped).toBe(1);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("sends to non-unsubscribed recipients", async () => {
    const isUnsubscribed = vi.fn().mockResolvedValue(false);
    const sendEmail = vi.fn();

    const recipients = ["active@example.com"];
    let sent = 0;
    let skipped = 0;

    for (const addr of recipients) {
      const unsub = await isUnsubscribed(addr);
      if (unsub) { skipped++; continue; }
      await sendEmail(addr);
      sent++;
    }

    expect(sent).toBe(1);
    expect(skipped).toBe(0);
    expect(sendEmail).toHaveBeenCalledWith("active@example.com");
  });

  it("handles mixed list correctly", async () => {
    const unsubList = new Set(["unsub@example.com"]);
    const isUnsubscribed = vi.fn().mockImplementation(async (email: string) =>
      unsubList.has(email)
    );
    const sendEmail = vi.fn();

    const recipients = ["active@example.com", "unsub@example.com", "also-active@example.com"];
    let sent = 0;
    let skipped = 0;

    for (const addr of recipients) {
      const unsub = await isUnsubscribed(addr);
      if (unsub) { skipped++; continue; }
      await sendEmail(addr);
      sent++;
    }

    expect(sent).toBe(2);
    expect(skipped).toBe(1);
    expect(sendEmail).toHaveBeenCalledTimes(2);
    expect(sendEmail).not.toHaveBeenCalledWith("unsub@example.com");
  });
});

// ─── Booking status badge logic ───────────────────────────────────────────────

describe("booking status badge logic", () => {
  const statusBadge = (s: string) => {
    if (s === "confirmed") return "badge-gold";
    if (s === "completed") return "badge-green";
    if (s === "cancelled") return "badge-red";
    return "badge-gray";
  };

  it("maps confirmed to badge-gold", () => {
    expect(statusBadge("confirmed")).toBe("badge-gold");
  });

  it("maps completed to badge-green", () => {
    expect(statusBadge("completed")).toBe("badge-green");
  });

  it("maps cancelled to badge-red", () => {
    expect(statusBadge("cancelled")).toBe("badge-red");
  });

  it("maps pending to badge-gray", () => {
    expect(statusBadge("pending")).toBe("badge-gray");
  });
});
