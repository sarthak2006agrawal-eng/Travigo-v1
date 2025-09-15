import express from "express";
import { getSnapshots } from "../controllers/snapshotController.js";

const router = express.Router();

router.get("/:userId", getSnapshots);

export default router;
