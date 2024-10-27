import { t } from "elysia";

export const AuthModel = t.Object({
	stxAddressMainnet: t.String({
		minLength: 1,
		require,
		default: "string",
	}),
	password: t.String({ minLength: 1, default: "string" }),
});

export const LoginResponseModel = t.Object({
	message: t.String({ default: "Login successful" }),
	accessToken: t.String(),
	refreshToken: t.String(),
	accessTokenExpiryTimestamp: t.Number({ default: Date.now() }),
	refreshTokenExpiryTimestamp: t.Number({ default: Date.now() }),
	user: t.Object({
		id: t.String({ format: "uuid" }),
		stxAddressMainnet: t.String(),
	}),
});

export const PayloadModel = t.Object({
	user: t.Object({
		stxAddressMainnet: t.String({ minLength: 1, require }),
		id: t.String({ format: "uuid" }),
	}),
	jti: t.String({ format: "uuid" }),
	refresh: t.Boolean(),
});
