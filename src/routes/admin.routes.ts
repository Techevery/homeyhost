import express from "express";
import {
  verifyAgent,
  createApartment,
  listProperties,
  listAgents,
} from "../handler/Admin";
import { authenticateAdmin } from "../middlewares/Admin";

const router = express.Router();

router.post("/upload-property", authenticateAdmin, createApartment);

router.put("/verify-agent", authenticateAdmin, verifyAgent);

router.get("/list-apartments", authenticateAdmin, listProperties);
router.get("/list-agents", listAgents);

export default router;
