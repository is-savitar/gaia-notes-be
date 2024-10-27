import Elysia, { t } from "elysia";
import bearer from "@elysiajs/bearer";
import { jwtPlugin } from "@/lib/auth";
import { db } from "@/db";
import { profileTable, userTable } from "@/db/schema";
import { selectUserSchema } from "@/db/schema/user";
import { AuthModel } from "@/models/auth";
import { ERRORS } from "@/models/error";
import { authService } from "@/services/auth";

const tags = ["Auth"];
export default new Elysia({
	tags,
	name: "api.auth.signup",
})
	.use(bearer())
	.model("AuthModel", AuthModel)
	.use(jwtPlugin)
	.guard(
		{
			body: AuthModel,
		},
		(app) =>
			app.post(
				"",
				async ({ body: { password, stxAddressMainnet }, set, error }) => {
					const existingUser = await authService.isUserExist(stxAddressMainnet);

					if (existingUser) {
						return error(409, {
							status: 409,
							detail: "Username already exists",
							error: "Conflict",
						});
					}

					const hashedPasswd = await Bun.password.hash(password);
					const [newUser] = await db
						.insert(userTable)
						.values({
							stxAddressMainnet,
							passwordHash: hashedPasswd,
						})
						.returning();

					await db.insert(profileTable).values({
						userId: newUser.id,
						username: stxAddressMainnet,
					});

					// const { password_hash, ...userWithoutPassword } = newUser;

					set.status = "Created";
					return newUser;
				},
				{
					response: {
						201: t.Omit(selectUserSchema, ["passwordHash", "updatedAt"]),
						409: ERRORS.CONFLICT,
					},
					detail: {
						summary: "Sign Up",
						description: "Creates a new User",
					},
				},
			),
	);
