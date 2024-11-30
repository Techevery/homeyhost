// import { Router } from "express";
// import { createAdminProfile, adminLogin } from "../handler/Admin";
// import { createAgent, agentLogin } from "../handler/Agent";

// class AuthRoutes {
//   public route: Router;

//   constructor() {
//     this.route = Router();
//     this.initializeRoutes();
//   }

//   private initializeRoutes(): void {
//     this.route
//      .post("/register-admin", createAdminProfile)
//      .post("/admin-login", adminLogin)
//      .post("/register-agent", createAgent)
//      .post("/agent-login", agentLogin)
//   }
// }

// export default new AuthRoutes()

import express from "express";
import { createAdminProfile, adminLogin } from "../handler/Admin";
import { createAgent,agentLogin } from "../handler/Agent";

const router = express.Router();

router.post("/register-agent", createAgent);
router.post("/agent-login", agentLogin);
router.post("/register-admin", createAdminProfile);
router.post("/admin-login", adminLogin)

export default router;
