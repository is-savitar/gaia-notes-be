import serverTiming from "@elysiajs/server-timing";
import Elysia from "elysia";
import logixlysia from "logixlysia";
import documentation from "./documentation";
import errorHandlers from "./error-handler";

export const plugins = new Elysia({ name: "plugins.index" })
	.use(serverTiming())
	.use(
		logixlysia({
			config: {
				showStartupMessage: true,
				startupMessageFormat: "simple",
				customLogFormat: "{level} {duration} {method} {pathname} {status}",
			},
		}),
	)
	.use(errorHandlers)
	.as("global")
	.use(documentation);
