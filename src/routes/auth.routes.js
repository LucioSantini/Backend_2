import { Router } from "express";
import { generateTokens } from "../utils/jwt.js";
import { comparePassword } from "../utils/auth.js";
import { validateLogin } from "../middlewares/validator.middleware.js";
import { githubCallback, Login, Logout } from "../controllers/auth.controllers.js"
import userModel from "../models/user.model.js";
import cookie from "express-session/session/cookie.js";
import passport from "passport";
const router= Router()

router.get('/github', passport.authenticate('github', {scope:["user:email"]}))

router.get('/github/callback', passport.authenticate('github',{failureRedirect:"/login"}), githubCallback)


router.post('/login', validateLogin, Login)

router.post('/logout', Logout)

export default router