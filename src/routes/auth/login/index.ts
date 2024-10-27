import Elysia from "elysia";
import bearer from "@elysiajs/bearer";
import { v4 as uuidv4 } from "uuid";
import { jwtPlugin } from "@/lib/auth";
import { AuthModel, LoginResponseModel } from "@/models/auth";
import { ERRORS } from "@/models/error";
import { authService } from "@/services/auth";

const tags = ["Auth"];
export default new Elysia({
	tags,
	name: "api.auth.index",
})
	.use(bearer())
	.model("AuthModel", AuthModel)
	.model("LoginResponseModel", LoginResponseModel)
	.use(jwtPlugin)
	.post(
		"/login",
		async ({
			body: { stxAddressMainnet, password },
			accessJwt,
			refreshJwt,
			error,
		}) => {
			const existingUser = await authService.isUserExist(stxAddressMainnet);

			if (!existingUser) {
				return error(401, {
					status: 401,
					detail: "Invalid Username or Password",
					error: "Unauthorized",
				});
			}

			const isMatch = await Bun.password.verify(
				password,
				existingUser.passwordHash,
			);

			if (!isMatch) {
				return error(401, {
					status: 401,
					detail: "Invalid Username or Password",
					error: "Unauthorized",
				});
			}

			const accessTokenExpiryTimestamp =
				Math.floor(Date.now() / 1000) + 15 * 60;
			const refreshTokenExpiryTimestamp =
				Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;

			const user = {
				stxAddressMainnet,
				id: existingUser.id,
			};

			const accessToken = await accessJwt.sign({
				user: user,
				jti: uuidv4(),
				refresh: false,
				exp: accessTokenExpiryTimestamp,
			});
			const refreshToken = await refreshJwt.sign({
				user: user,
				jti: uuidv4(),
				refresh: true,
				exp: refreshTokenExpiryTimestamp,
			});

			return {
				message: "Login successful",
				accessToken,
				refreshToken,
				accessTokenExpiryTimestamp,
				refreshTokenExpiryTimestamp,
				user,
			};
		},
		{
			body: "AuthModel",
			response: {
				401: ERRORS.UNAUTHORIZED,
				200: LoginResponseModel,
			},
			detail: {
				summary: "Login",
				description: "Logs in a user",
			},
		},
	);
