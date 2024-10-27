import type { ElysiaWithBaseUrl } from "elysia-autoload";
import type Route0 from "../routes/index";
import type Route1 from "../routes/profile/index";
import type Route2 from "../routes/auth/signup/index";
import type Route3 from "../routes/auth/logout/index";
import type Route4 from "../routes/auth/login/index";
import type Route5 from "../routes/auth/refresh-token/index";

declare global {
    export type EdenRoutes = ElysiaWithBaseUrl<"/api/v1", typeof Route0>
              & ElysiaWithBaseUrl<"/api/v1profile", typeof Route1>
              & ElysiaWithBaseUrl<"/api/v1auth/signup", typeof Route2>
              & ElysiaWithBaseUrl<"/api/v1auth/logout", typeof Route3>
              & ElysiaWithBaseUrl<"/api/v1auth/login", typeof Route4>
              & ElysiaWithBaseUrl<"/api/v1auth/refresh-token", typeof Route5>
}