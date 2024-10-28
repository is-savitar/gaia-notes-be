// blog.ts
import {
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { categoryTable, userTable } from ".";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { postToCategory } from "./category";

export const statusEnum = pgEnum("status", ["published", "draft", "archived"]);

export const blog = pgTable("post", {
	id: uuid("id").primaryKey().defaultRandom().notNull(),
	userId: uuid("user_id")
		.notNull()
		.references(() => userTable.id),
	title: varchar("title", { length: 255 }).notNull(),
	tagline: varchar("tagline", { length: 255 }),
	status: statusEnum("status").notNull().default("draft"),
	coverImage: text("cover_image"),
	content: text("content").notNull(),
	createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { mode: "string" })
		.notNull()
		.defaultNow()
		.$onUpdate(() => sql`now()`),
});

export const postRelations = relations(blog, ({ one, many }) => ({
	author: one(userTable, {
		fields: [blog.userId],
		references: [userTable.id],
	}),
	categories: many(postToCategory),
}));

// Relations for the junction table
export const postToCategoryRelations = relations(postToCategory, ({ one }) => ({
	post: one(blog, {
		fields: [postToCategory.postId],
		references: [blog.id],
	}),
	category: one(categoryTable, {
		fields: [postToCategory.categoryId],
		references: [categoryTable.id],
	}),
}));

export const insertPostSchema = createInsertSchema(blog, {
	status: t.Enum({
		published: "published",
		draft: "draft",
		archived: "archived",
	}),
	categoryIds: t.Array(t.String()), // For validation only, not part of the table
});

export const selectPostSchema = createSelectSchema(blog);
