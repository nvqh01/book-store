import express from "express";

import { userController } from "../controllers/index";

const router = express.Router();

router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/refresh-token", userController.refreshToken);
router.post("/register", userController.register);

module.exports = router;
