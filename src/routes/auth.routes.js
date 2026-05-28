import { Router } from "express";
import { generateTokens } from "../utils/jwt.js";
import { comparePassword } from "../utils/auth.js";
import { validateLogin } from "../middlewares/validator.middleware.js";
import userModel from "../models/user.model.js";
import cookie from "express-session/session/cookie.js";
import passport from "passport";
const router= Router()

router.get('/github', passport.authenticate('github', {scope:["user:email"]}))

router.get('/github/callback', passport.authenticate('github',{failureRedirect:"/login"}), (req, res)=>{
    res.redirect("/api/users/profile")
})


router.post('/login', validateLogin, async (req, res)=>{
    const { email, password }= req.body
    try {



        const user= await userModel.findOne({email})
        const insValidPassword = await comparePassword(password, user.password)
        if(!user || !insValidPassword)return res.status(401).json({message:"Email o password invalidos"})
        
        const {accessToken, refreshToken} = generateTokens(user)

        res.cookie('refreshToken', refreshToken, {httpOnly:true,secure:false,maxAge:7*24*60*1000})


        req.session.user= {
            id: user._id,
            email: user.email
        }

        res.status(200).json({message: "Sesion iniciada", accessToken, user: req.session.user})

    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })

    }
})

router.post('/logout', async (req, res)=>{
    req.session.destroy((err)=>{
        if(err) return res.status(500).json({message:"Error al cerrar sesion"})
        res.clearCookie("connect.sid")
        res.status(200).json({ message: "Sesion cerrada" })
    })
})

export default router