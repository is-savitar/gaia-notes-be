import { selectProfileSchema } from "@/db/schema/profile";
import { NotFoundError } from "@/exceptions/errors";
import { ERRORS } from "@/models/error";
import profileService from "@/services/profile";
import { accessTokenSecurity } from "@/utils/security";
import Elysia, { t } from "elysia";

const tags = ["Profile"];
export default new Elysia({ name: "api.profile.username", tags }).get(
	"",
	async ({ params: { username } }) => {
		const profile = await profileService.get(username);

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
		params: t.Object({
			username: t.String({ default: "string" }),
		}),
		detail: {
			summary: "Get Profile using username",
			description: "Gets a user profile using username",
			security: accessTokenSecurity,
		},
	},
);
