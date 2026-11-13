import { Hono } from "hono";
import type { AppEnv } from "../env";
import { clientRoutes, projectRoutes } from "./clients";
import { coreRoutes } from "./core";
import { dealRoutes } from "./deals";
import { deleteRoutes } from "./deletes";
import { invoiceRoutes } from "./invoices";

/** Every /api/os/* route. Mounted behind requireAdmin. */
export const osRoutes = new Hono<AppEnv>()
  .route("/", coreRoutes)
  .route("/", dealRoutes)
  .route("/", clientRoutes)
  .route("/", projectRoutes)
  .route("/", invoiceRoutes)
  .route("/", deleteRoutes);

export { portalRoutes } from "./portal";
