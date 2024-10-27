import { t } from "elysia";

export const CONFLICT = t.Object({
	status: t.Number({ default: 409 }),
	detail: t.String(),
	error: t.String({ default: "CONFLICT" }),
});

export const NOT_FOUND = t.Object({
	status: t.Number({ default: 404 }),
	detail: t.String(),
	error: t.String({ default: "NOT_FOUND" }),
});

export const UNAUTHORIZED = t.Object({
	status: t.Number({ default: 401 }),
	detail: t.String(),
	error: t.String({ default: "AUTHORIZATION_ERROR" }),
});

export const INVARIANT = t.Object({
	status: t.Number({ default: 401 }),
	detail: t.String(),
	error: t.String({ default: "INVARIANT_ERROR" }),
});

export const INTERNAL_SERVER_ERROR = t.Object({
	status: t.Number({ default: 401 }),
	detail: t.String(),
	error: t.String({ default: "INTERNAL_SERVER_ERROR" }),
});

export const ERRORS = {
	CONFLICT,
	NOT_FOUND,
	UNAUTHORIZED,
	INVARIANT,
	INTERNAL_SERVER_ERROR,
};
