import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { blogTable } from ".";
import { TIMESTAMP, UUID } from "../utils";

export const category = pgTable("category", {
	...UUID,
	name: varchar("name", { length: 100 }).notNull().unique(),
	...TIMESTAMP,
});

// Junction table for many-to-many relationship
export const postToCategory = pgTable("post_to_category", {
	postId: uuid("post_id")
		.notNull()
		.references(() => blogTable.id),
	categoryId: uuid("category_id")
		.notNull()
		.references(() => category.id),
});

export const categoryRelations = relations(category, ({ many }) => ({
	posts: many(postToCategory),
}));

export const insertCategorySchema = createInsertSchema(category, {
	name: t.String({ minLength: 1 }),
});

export const selectCategorySchema = createSelectSchema(category);
