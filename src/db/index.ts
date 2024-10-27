import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import env from "../env";
import * as schema from "./schema";

export const client = postgres(env.DATABASE_URL, {
	ssl: "require",
	max: env.DB_MIGRATING || env.DB_SEEDING ? 1 : 1,
	onnotice: env.DB_SEEDING ? () => {} : undefined,
});

export const db = drizzle(client, {
	logger: true,
	schema,
});
