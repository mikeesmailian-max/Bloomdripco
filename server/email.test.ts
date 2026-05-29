/**
 * Tests for server/email.ts
 *
 * We mock the Resend SDK so no real network calls are made.
 * Each test verifies that the correct fields (from, to, replyTo, subject)
 * are forwarded to Resend's emails.send() method.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock the Resend SDK before importing the module under test ────────────────
const mockSend = vi.fn().mockResolvedValue({ data: { id: "test-id" }, error: null });
const mockDomainsList = vi.fn().mockResolvedValue({ data: [], error: null });

vi.mock("resend", () => {
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: { send: mockSend },
      domains: { list: mockDomainsList },
    })),
  };
});

// ── Mock ENV so the module doesn't throw about a missing key ─────────────────
vi.mock("./_core/env", () => ({
  ENV: { resendApiKey: "re_test_key" },
}));

// Import AFTER mocks are set up
import {
  sendBookingEmails,
  sendLeadWelcomeEmail,
  sendGenericEmail,
  validateResendKey,
} from "./email";

const ADMIN_EMAIL = "info@bloomdripco.com";

beforeEach(() => {
  mockSend.mockClear();
  mockDomainsList.mockClear();
});

// ─────────────────────────────────────────────────────────────────────────────
describe("sendBookingEmails", () => {
  const booking = {
    name: "Jane Doe",
    phone: "310-555-0001",
    email: "jane@example.com",
    service: "Myers Cocktail",
    date: "2026-06-01",
    notes: "Hotel lobby",
  };

  it("sends two emails when client email is provided", async () => {
    await sendBookingEmails(booking);
    expect(mockSend).toHaveBeenCalledTimes(2);
  });

  it("sends only admin notification when client email is empty", async () => {
    await sendBookingEmails({ ...booking, email: "" });
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it("admin email goes to info@bloomdripco.com", async () => {
    await sendBookingEmails(booking);
    const adminCall = mockSend.mock.calls[0][0];
    expect(adminCall.to).toContain(ADMIN_EMAIL);
  });

  it("admin email replyTo is the client email", async () => {
    await sendBookingEmails(booking);
    const adminCall = mockSend.mock.calls[0][0];
    expect(adminCall.replyTo).toBe(booking.email);
  });

  it("client confirmation email replyTo is info@bloomdripco.com", async () => {
    await sendBookingEmails(booking);
    const clientCall = mockSend.mock.calls[1][0];
    expect(clientCall.replyTo).toBe(ADMIN_EMAIL);
  });

  it("client confirmation goes to the client email address", async () => {
    await sendBookingEmails(booking);
    const clientCall = mockSend.mock.calls[1][0];
    expect(clientCall.to).toContain(booking.email);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("sendLeadWelcomeEmail", () => {
  const lead = { name: "Alex Smith", email: "alex@example.com" };

  it("sends two emails (welcome + admin notification)", async () => {
    await sendLeadWelcomeEmail(lead);
    expect(mockSend).toHaveBeenCalledTimes(2);
  });

  it("welcome email replyTo is info@bloomdripco.com", async () => {
    await sendLeadWelcomeEmail(lead);
    const welcomeCall = mockSend.mock.calls[0][0];
    expect(welcomeCall.replyTo).toBe(ADMIN_EMAIL);
  });

  it("admin notification replyTo is the lead email", async () => {
    await sendLeadWelcomeEmail(lead);
    const adminCall = mockSend.mock.calls[1][0];
    expect(adminCall.replyTo).toBe(lead.email);
  });

  it("admin notification goes to info@bloomdripco.com", async () => {
    await sendLeadWelcomeEmail(lead);
    const adminCall = mockSend.mock.calls[1][0];
    expect(adminCall.to).toContain(ADMIN_EMAIL);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("sendGenericEmail", () => {
  it("sends one email", async () => {
    await sendGenericEmail({
      to: "client@example.com",
      subject: "Test subject",
      html: "<p>Hello</p>",
    });
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it("always sets replyTo to info@bloomdripco.com", async () => {
    await sendGenericEmail({
      to: "client@example.com",
      subject: "Test subject",
      html: "<p>Hello</p>",
    });
    const call = mockSend.mock.calls[0][0];
    expect(call.replyTo).toBe(ADMIN_EMAIL);
  });

  it("accepts an array of recipients", async () => {
    await sendGenericEmail({
      to: ["a@example.com", "b@example.com"],
      subject: "Batch",
      html: "<p>Hi</p>",
    });
    const call = mockSend.mock.calls[0][0];
    expect(call.to).toHaveLength(2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("validateResendKey", () => {
  it("returns true when Resend responds without error", async () => {
    const result = await validateResendKey();
    expect(result).toBe(true);
  });

  it("returns false when Resend throws", async () => {
    mockDomainsList.mockRejectedValueOnce(new Error("network error"));
    const result = await validateResendKey();
    expect(result).toBe(false);
  });
});
