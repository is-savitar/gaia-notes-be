import { selectUserSchema } from "@/db/schema/user";

export type User = typeof selectUserSchema.static;
