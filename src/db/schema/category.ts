import { relations, sql } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-typebox";
import { t } from "elysia";

export const category = pgTable("category", {
	id: uuid("id").primaryKey().notNull().defaultRandom(),
	name: varchar("name", { length: 100 }).notNull().unique(),
	createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { mode: "string" })
		.notNull()
		.defaultNow()
		.$onUpdate(() => sql`now()`),
});

export const categoryRelations = relations(category, ({ many }) => ({
	posts: many(postTable),
}));

export const insertCategorySchema = createInsertSchema(category, {
	name: t.String({ minLength: 1 }),
});
export const selectCategorySchema = createInsertSchema(category);
