import { Elysia } from "elysia";
import { autoload } from "elysia-autoload";
import documentation from "./lib/plugins/documentation";

const prefix = "/api/v1//" as const;

const app = new Elysia({ name: "app" }).use(documentation).use(
	await autoload({
		prefix,
		dir: "./routes/",
		types: {
			output: "./lib/routes.ts",
			typeName: "EdenRoutes",
		},
	}),
);

await app.modules;
app.listen(3002, () => app.routes.map((x) => x.path));

export type ElysiaApp = typeof app;
