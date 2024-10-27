import Elysia, { t } from "elysia";
import bearer from "@elysiajs/bearer";
import { v4 as uuidv4 } from "uuid";
import { jwtPlugin, refreshTokenPlugin } from "@/lib/auth";
import { AuthorizationError } from "@/exceptions/errors";
import { AuthModel, LoginResponseModel } from "@/models/auth";
import { ERRORS } from "@/models/error";
import { refreshTokenSecurity } from "@/utils/security";

const tags = ["Auth"];
export default new Elysia({
	tags,
	name: "api.auth.index",
})
	.use(bearer())
	.model("AuthModel", AuthModel)
	.model("LoginResponseModel", LoginResponseModel)
	.use(jwtPlugin)
	.guard(
		{
			detail: {
				security: refreshTokenSecurity,
				description: "Require user to be logged in",
			},
		},
		(app) =>
			app.use(refreshTokenPlugin).get(
				"",
				async ({ accessJwt, payload }) => {
					const accessTokenExpiry = Math.floor(Date.now() / 1000) + 15 * 60;

					if (payload) {
						const accessToken = await accessJwt.sign({
							user: payload && payload.user,
							jti: uuidv4(),
							refresh: false,
							exp: accessTokenExpiry,
						});

						return {
							accessToken,
							accessTokenExpiry,
						};
					}
					throw new AuthorizationError("Unauthorized");
				},
				{
					async beforeHandle({ payload }) {
						if (!payload) {
							throw new AuthorizationError("Invalid Token");
						}
					},
					response: {
						200: t.Object({
							accessToken: t.String(),
							accessTokenExpiry: t.Number({
								default: Date.now(),
							}),
						}),
						401: ERRORS.UNAUTHORIZED,
					},
					detail: {
						summary: "Refresh",
						description: "Refresh access token",
					},
				},
			),
	);
