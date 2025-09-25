import { Router } from "express";
import {getUserById,} from "../controllers/user.js";

const router = new Router();

router.get("/:id", getUserById);

export default router;