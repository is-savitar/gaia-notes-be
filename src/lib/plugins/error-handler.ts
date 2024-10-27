import { InternalServerError, NotFoundError, t } from "elysia";
import { Elysia } from "elysia";
import {
	AuthenticationError,
	AuthorizationError,
	InvariantError,
	ConflictError,
} from "@/exceptions/errors";
import { ERRORS } from "@/models/error";

const errorHandlers = new Elysia({ name: "plugin.errors" })
	.model(
		"ErrorModels",
		t.Object({
			UNAUTHORIZED: ERRORS.UNAUTHORIZED,
			NOT_FOUND: ERRORS.NOT_FOUND,
			CONFLICT: ERRORS.CONFLICT,
		}),
	)
	.error("AUTHENTICATION_ERROR", AuthenticationError)
	.error("AUTHORIZATION_ERROR", AuthorizationError)
	.error("INVARIANT_ERROR", InvariantError)
	.error("NOT_FOUND", NotFoundError)
	.error("INTERNAL_SERVER_ERROR", InternalServerError)
	.error("CONFLICT_ERROR", ConflictError)
	.onError(({ code, error, set }) => {
		set.headers["content-type"] = "application/json";
		console.log(code, error);

		switch (code) {
			case "AUTHORIZATION_ERROR":
				set.status = 401;
				return {
					status: 401,
					error: error.name,
					detail: error.message,
				};
			case "CONFLICT_ERROR":
				set.status = 409;
				return {
					status: 409,
					error: error.name,
					detail: error.message,
				};
			case "INVARIANT_ERROR":
				set.status = 400;
				return {
					status: 400,
					error: error.name,
					detail: error.message,
				};
			case "NOT_FOUND":
				set.status = 404;
				return {
					status: 404,
					error: error.name,
					detail: error.message,
				};

			case "INTERNAL_SERVER_ERROR":
				set.status = 500;
				return {
					status: 500,
					error: error.name,
					detail: error.message,
				};
		}
	})
	.as("global");

export default errorHandlers;
