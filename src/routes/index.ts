import Elysia from "elysia";

export default new Elysia().get(
	"",
	() => {
		return {
			hello: "World",
		};
	},
	{
		detail: {
			hide: true,
		},
	},
);
