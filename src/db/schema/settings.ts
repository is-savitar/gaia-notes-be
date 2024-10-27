import { relations, sql } from "drizzle-orm";
import { timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { pgTable, uuid } from "drizzle-orm/pg-core";
import { user } from "./user";
import { TIMESTAMP, UUID } from "../utils";

const settings = pgTable(
	"settings",
	{
		...UUID,
		...TIMESTAMP,
		userId: uuid("user_id")
			.notNull()
			.references(() => user.id),
	},
	(table) => {
		return {
			userIdIdx: uniqueIndex("user_id_idx").on(table.userId),
		};
	},
);

export const settingsRelations = relations(settings, ({ one }) => ({
	user: one(user, { fields: [settings.userId], references: [user.id] }),
}));
export default settings;