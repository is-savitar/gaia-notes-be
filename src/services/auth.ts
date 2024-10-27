import { db } from "@/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const authService = {
	isUserExist: async (stxAddressMainnet: string) => {
		const [existingUser] = await db
			.select()
			.from(userTable)
			.where(eq(userTable.stxAddressMainnet, stxAddressMainnet));

		return existingUser;
	},
};
