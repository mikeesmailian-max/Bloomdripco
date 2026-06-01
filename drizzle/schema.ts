import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Bookings ─────────────────────────────────────────────────────────────────
/**
 * Stores every booking request submitted via the website.
 * Status progresses: pending → confirmed → completed | cancelled.
 */
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 64 }),
  email: varchar("email", { length: 320 }),
  service: varchar("service", { length: 255 }).notNull(),
  preferredDate: varchar("preferredDate", { length: 128 }),
  notes: text("notes"),
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"])
    .default("pending")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

// ─── Email Unsubscribes ───────────────────────────────────────────────────────
/**
 * Tracks email addresses that have opted out of marketing emails.
 * Each record holds a unique token used in the one-click unsubscribe link.
 * The token is generated per-email so it cannot be guessed or bulk-harvested.
 */
export const unsubscribes = mysqlTable("unsubscribes", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  /** UUID token embedded in the unsubscribe link — single-use, non-guessable. */
  token: varchar("token", { length: 64 }).notNull().unique(),
  unsubscribedAt: timestamp("unsubscribedAt").defaultNow().notNull(),
});

export type Unsubscribe = typeof unsubscribes.$inferSelect;
export type InsertUnsubscribe = typeof unsubscribes.$inferInsert;
