import Elysia, { t } from "elysia";
import bearer from "@elysiajs/bearer";
import { jwtPlugin, accessTokenPlugin } from "@/lib/auth";
import { AuthorizationError } from "@/exceptions/errors";
import { AuthModel, LoginResponseModel } from "@/models/auth";
import { ERRORS } from "@/models/error";
import { accessTokenSecurity } from "@/utils/security";

const tags = ["Auth"];
export default new Elysia({
	tags,
	name: "api.auth.logout",
})
	.use(bearer())
	.model("AuthModel", AuthModel)
	.model("LoginResponseModel", LoginResponseModel)
	.use(jwtPlugin)
	.guard(
		{
			detail: {
				security: accessTokenSecurity,
				description: "Requires user to be logged in",
			},
		},
		(app) =>
			app.use(accessTokenPlugin).get(
				"",
				async ({ payload }) => {
					console.log(payload);

					return {
						status: 200,
						detail: "Logged out successfully",
					};
				},
				{
					async beforeHandle({ payload }) {
						if (!payload) {
							throw new AuthorizationError("Invalid Token");
						}
					},
					response: {
						200: t.Object({
							status: t.Number({ default: 200 }),
							detail: t.String({ default: "Logout successful" }),
						}),
						401: ERRORS.UNAUTHORIZED,
					},
					detail: {
						summary: "Logout",
						description: "Logs current user out",
						security: accessTokenSecurity,
					},
				},
			),
	);
