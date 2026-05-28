import { Router } from "express";
import userModel from "../models/user.model.js";
import passport from "passport";
// import { hashPassword } from "../utils/auth.js";
// import { isAuth } from "../middlewares/auth.middleware.js";
import {authorizeRoles} from "../middlewares/auth.middleware.js"
import { getAll, getProfile, DeleteAccount, create} from "../controllers/user.controllers.js"

const router = Router()

router.get("/", passport.authenticate(['jwt', 'session'], {session:false}), authorizeRoles([]), getAll)

router.post("/register", passport.authenticate('register', {session:false}), create)

// router.get("/profile", isAuth, async(req, res) => {
router.get("/profile", passport.authenticate(['jwt', 'session'], {session:false}), getProfile)

router.delete("/:id", passport.authenticate(['jwt', 'session'], {session:false}), authorizeRoles([]), DeleteAccount)


export default router