import { migrate } from "drizzle-orm/postgres-js/migrator";
import env from "../env";
import drizzleConfig from "../../drizzle.config";
import { client, db } from ".";

if (!env.DB_MIGRATING) {
	throw new Error(
		// SRC: CJay on youtube
		'You must set DB_MIGRATING to "true" when running migrations',
	);
}

await migrate(db, { migrationsFolder: drizzleConfig.out! });

await client.end();
