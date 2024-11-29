import { Router } from "express";
import { verifyAgent, createApartment } from "../handler/Admin";
import { authenticateAdmin } from "../middlewares/Admin";

class AdminRoutes {
  public route: Router;

  constructor() {
    this.route = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route
    .post("/add-property", authenticateAdmin, createApartment)
    .put("/verify-agent", authenticateAdmin, verifyAgent)
  }
}

export default new AdminRoutes();