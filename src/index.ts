import { Elysia } from "elysia";
import { autoload } from "elysia-autoload";
import { plugins } from "./lib/plugins";

const prefix = "/api/v1/" as const;

const app = new Elysia({ name: "app" })
	.use(plugins)
	.use(
		await autoload({
			prefix,
			dir: "./routes/",
			types: {
				output: "./lib/routes.ts",
				typeName: "EdenRoutes",
			},
		}),
	)
	.listen(3000);

await app.modules;
export type ElysiaApp = typeof app;
