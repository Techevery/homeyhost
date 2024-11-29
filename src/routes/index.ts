import { Router } from "express";
import AuthRoutes from "./auth.routes";
import AdminRoutes from "./admin.routes"
// import AgentRoutes from "./agent.routes";

const router = Router();

router.use("/auth", AuthRoutes.route);
router.use("/admin", AdminRoutes.route);

export default router;