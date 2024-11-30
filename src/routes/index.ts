import { Router } from "express";
import AuthRoutes from "./auth.routes";
import AdminRoutes from "./admin.routes"
// import AgentRoutes from "./agent.routes";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/admin", AdminRoutes);

export default router;