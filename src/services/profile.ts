import { db } from "@/db";
import { profileTable } from "@/db/schema";
import { InternalServerError } from "@/exceptions/errors";
import { and, eq } from "drizzle-orm";
import postgres from "postgres";

const profileService = {
	get: async (username: string) => {
		const [profile] = await db
			.select()
			.from(profileTable)
			.where(eq(profileTable.username, username));

		return profile;
	},

	patch: async (
		id: string,
		data: Partial<typeof profileTable.$inferInsert>,
	) => {
		try {
			const { userId: _, id: __, ...updateData } = data;

			if (Object.keys(updateData).length === 0) {
				throw new Error("No fields provided to update");
			}

			const [updatedProfile] = await db
				.update(profileTable)
				.set({ ...updateData })
				.where(eq(profileTable.id, id))
				.returning();

			return updatedProfile;
		} catch (err) {
			console.log(err);
			if (err instanceof postgres.PostgresError) {
				throw new InternalServerError("lol");
			}
		}
	},

	isOwner: async (id: string, userId: string) => {
		const [profile] = await db
			.select()
			.from(profileTable)
			.where(and(eq(profileTable.id, id), eq(profileTable.userId, userId)));

		return profile;
	},
};

export default profileService;
