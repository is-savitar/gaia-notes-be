import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { UUID, TIMESTAMP } from "../utils";

export const user = pgTable("user", {
	...UUID,
	...TIMESTAMP,
	stxAddressMainnet: text("stx_address_mainnet").notNull(),
	btcAddressMainnet: text("btc_address_mainnet"),
	passwordHash: text("password_hash").notNull(),
});

export const selectUserSchema = createSelectSchema(user);
export const insertUserSchema = createInsertSchema(user);
