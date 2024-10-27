import { insertProfileSchema, selectProfileSchema } from "@/db/schema/profile";
import { AuthorizationError, InternalServerError } from "@/exceptions/errors";
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
			app.patch(
				"",
				async ({ body, payload, params: { id } }) => {
					const existingProfile = await profileService.isOwner(
						id,
						payload && "user" in payload ? payload.user.id : "",
					);

					if (!existingProfile) {
						throw new AuthorizationError(
							"You do not have permission to edit this profile",
						);
					}

					const updatedProfile = await profileService.patch(id, body);
					if (!updatedProfile) {
						throw new InternalServerError("An unexpected error occured");
					}

					return updatedProfile;
				},
				{
					response: {
						200: selectProfileSchema,
						401: ERRORS.UNAUTHORIZED,
						500: ERRORS.INTERNAL_SERVER_ERROR,
					},
					params: t.Object({
						id: t.String(),
					}),
					body: t.Partial(
						t.Omit(insertProfileSchema, ["id", "createdAt", "updatedAt"]),
					),
				},
			),
	);
