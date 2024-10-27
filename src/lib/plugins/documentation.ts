import swagger from "@elysiajs/swagger";
import type Elysia from "elysia";

const tags: { name: string; description: string }[] = [
	{ name: "Auth", description: "Authentication endpoints" },
	{ name: "Posts", description: "Posts endpoints" },
	{ name: "Users", description: "Users endpoints" },
	{ name: "Categories", description: "Categories endpoints" },
	{ name: "Health", description: "Health Endpoints" },
];

const hiddenClients = {
	shell: true,
	swift: true,
	java: true,
	node: true,
	php: true,
	powershell: true,
	python: true,
	r: true,
	ruby: true,
	csharp: true,
	kotlin: true,
	objc: true,
	ocaml: true,
	clojure: true,
};

const documentation = (app: Elysia) =>
	app.use(
		swagger({
			exclude: ["/doc", "/doc/json"],
			excludeTags: ["default"],
			path: "/docs",
			scalarConfig: {
				defaultHttpClient: {
					targetKey: "javascript",
					clientKey: "fetch",
				},
				hiddenClients,
				defaultOpenAllTags: true,
			},
			documentation: {
				components: {
					securitySchemes: {
						AccessTokenBearer: {
							type: "http",
							scheme: "bearer",
							bearerFormat: "JWT",
						},
						RefreshTokenBearer: {
							type: "http",
							scheme: "bearer",
							bearerFormat: "JWT",
						},
					},
				},
				info: {
					title: "Stx-Support Documentation",
					version: "1.0.0",
					license: {
						name: "MIT",
						url: "https://opensource.org/license/mit/",
					},
					contact: {
						name: "Al-Ameen Adeyemi",
						url: "https://github.com/adeyemialameen04",
					},
				},
				tags,
			},
		}),
	);
export default documentation;
