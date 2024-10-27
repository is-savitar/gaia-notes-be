import { relations } from "drizzle-orm";
import { varchar, text, uniqueIndex } from "drizzle-orm/pg-core";
import { pgTable, uuid } from "drizzle-orm/pg-core";
import { user } from "./user";
import { createSelectSchema } from "drizzle-typebox";
import { UUID, TIMESTAMP } from "../utils";

export const profile = pgTable(
	"profile",
	{
		...UUID,
		...TIMESTAMP,
		username: varchar("username", { length: 255 }).unique(),
		name: varchar("name", { length: 100 }),
		profileImg: text("profile_img"),
		coverImg: text("cover_img"),
		about: text("about"),
		userId: uuid("user_id")
			.notNull()
			.references(() => user.id),
	},
	(table) => {
		return {
			usernameIdx: uniqueIndex("username_idx").on(table.username),
		};
	},
);

export const profileRelations = relations(profile, ({ one }) => ({
	user: one(user, { fields: [profile.userId], references: [user.id] }),
}));

export const selectProfileSchema = createSelectSchema(profile);
export const insertProfileSchema = createSelectSchema(profile);
