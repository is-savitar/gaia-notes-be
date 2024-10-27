import postgres from "postgres";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { InvariantError } from "@/exceptions/errors";
import { userTable } from "@/db/schema";

export const userService = {
	updateUser: async (
		id: string,
		data: Partial<typeof userTable.$inferInsert>,
	) => {
		try {
			const { id: _, ...updateData } = data;

			const [updatedPost] = await db
				.update(userTable)
				.set({ ...updateData })
				.where(eq(userTable.id, id))
				.returning();

			return updatedPost;
		} catch (err) {
			if (err instanceof postgres().PostgresError) {
				if (err.code === "23503") {
					if (err.detail?.includes("category_id")) {
						throw new InvariantError("Invalid category ID");
					}
					if (err.detail?.includes("user_id")) {
						throw new InvariantError("Invalid User ID");
					}
				}
			}
		}
	},
	isOwner: async (id: string, userId: string) => {
		const post = await db.select().from(userTable).where(eq(userTable.id, id));

		return post;
	},

	getUser: async (id: string) => {
		const user = await db.query.userTable.findFirst({
			where: eq(userTable.id, id),
		});

		return user;
	},
};
