import { insertProfileSchema, selectProfileSchema } from "@/db/schema/profile";
import { AuthorizationError, NotFoundError } from "@/exceptions/errors";
import { accessTokenPlugin } from "@/lib/auth";
import { ERRORS } from "@/models/error";
import profileService from "@/services/profile";
import { accessTokenSecurity } from "@/utils/security";
import Elysia, { t } from "elysia";

const tags = ["Profile"];
export default new Elysia({ name: "api.profile.index", tags })
	.use(accessTokenPlugin)
	.guard(
		{
			detail: {
				security: accessTokenSecurity,
			},
			async beforeHandle({ payload }) {
				if (!payload) {
					throw new AuthorizationError("Invalid Token");
				}
			},
		},
		(app) =>
			app
				.get(
					"",
					async ({ payload }) => {
						const profile = await profileService.get(
							payload && "user" in payload ? payload.user.id : "",
						);

						if (!profile) {
							throw new NotFoundError("User profile not found");
						}

						return profile;
					},
					{
						response: {
							200: selectProfileSchema,
							404: ERRORS.NOT_FOUND,
						},
						detail: {
							summary: "Get Profile",
							description: "Gets a user profile",

							security: accessTokenSecurity,
						},
					},
				)
				.patch(
					"",
					async ({ body }) => {
						// const up
					},
					{
						body: t.Omit(insertProfileSchema, ["id", "createdAt", "updatedAt"]),
					},
				),
	);
