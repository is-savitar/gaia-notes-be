import type { ElysiaWithBaseUrl } from "elysia-autoload";
import type Route0 from "../routes/index";

declare global {
    export type EdenRoutes = ElysiaWithBaseUrl<"/api/v1/", typeof Route0>
}