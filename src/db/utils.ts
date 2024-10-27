import { sql } from "drizzle-orm";
import { timestamp, uuid } from "drizzle-orm/pg-core";

export const UUID = {
	id: uuid("id").primaryKey().defaultRandom(),
};

export const TIMESTAMP = {
	createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { mode: "string" })
		.notNull()
		.defaultNow()
		.$onUpdate(() => sql`now()`),
};
