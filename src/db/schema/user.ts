import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";

export const user = pgTable("user", {
	id: uuid("id").primaryKey().defaultRandom(),
	stxAddressMainnet: text("stx_address_mainnet").notNull(),
	btcAddressMainnet: text("btc_address_mainnet"),
	passwordHash: text("password_hash").notNull(),
	createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { mode: "string" })
		.notNull()
		.defaultNow()
		.$onUpdate(() => sql`now()`),
});

export const selectUserSchema = createSelectSchema(user);
export const insertUserSchema = createInsertSchema(user);
