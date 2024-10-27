import bearer from "@elysiajs/bearer";
import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import env from "../env";
import { AuthorizationError } from "@/exceptions/errors";
import { PayloadModel } from "@/models/auth";

export const jwtPlugin = new Elysia({ name: "jwt/plugin" })
	.use(bearer())
	.use(
		jwt({
			name: "accessJwt",
			secret: env.ACCESS_SECRET_KEY,
			exp: "15m",
			schema: PayloadModel,
		}),
	)
	.use(
		jwt({
			name: "refreshJwt",
			secret: env.REFRESH_SECRET_KEY,
			exp: "7d",
			schema: PayloadModel,
		}),
	)
	.guard({
		as: "scoped",
	});

export const accessTokenPlugin = new Elysia({ name: "plugin.access" })
	.use(bearer())
	.use(
		jwt({
			name: "accessJwt",
			secret: env.ACCESS_SECRET_KEY,
			exp: "15m",
			schema: PayloadModel,
		}),
	)
	.guard({
		as: "scoped",
	})
	.derive({ as: "scoped" }, async ({ bearer, accessJwt }) => {
		if (!bearer) {
			return { payload: null };
		}

		const token = await accessJwt.verify(bearer);
		if (token && token?.refresh) {
			throw new AuthorizationError(
				"Invalid token type. Access token required.",
			);
		}

		return {
			payload: token,
		};
	});

export const refreshTokenPlugin = new Elysia({ name: "plugin.refresh" })
	.use(bearer())
	.use(
		jwt({
			name: "refreshJwt",
			secret: env.REFRESH_SECRET_KEY,
			exp: "7d",
			schema: PayloadModel,
		}),
	)
	.guard({
		as: "scoped",
	})
	.derive({ as: "scoped" }, async ({ bearer, refreshJwt }) => {
		if (!bearer) {
			return { payload: null };
		}

		try {
			const token = await refreshJwt.verify(bearer);
			if (token && !token.refresh) {
				throw new AuthorizationError(
					"Invalid token type. Refresh token required.",
				);
			}

			return {
				payload: token,
			};
		} catch (err) {
			console.log(err);

			return {
				payload: null,
			};
		}
	});
