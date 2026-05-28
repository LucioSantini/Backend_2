import { generateTokens } from "../utils/jwt.js";
import { comparePassword } from "../utils/auth.js";
import userModel from "../models/user.model.js";

export const githubCallback = (req, res)=>{
    res.redirect("/api/users/profile")
}

export const Login = async (req, res)=>{
    const { email, password }= req.body
    try {



        const user= await userModel.findOne({email})
        const insValidPassword = await comparePassword(password, user.password)
        if(!user || !insValidPassword)return res.status(401).json({message:"Email o password invalidos"})
        
        const {accessToken, refreshToken} = generateTokens(user)

        res.cookie('accessToken', accessToken, {httpOnly:true,secure:false, sameSite: "lax", maxAge:7*24*60*1000})
        res.cookie('refreshToken', refreshToken, {httpOnly:true,secure:false, sameSite: "lax",maxAge:7*24*60*1000})


        req.session.user= {
            id: user._id,
            email: user.email
        }

        res.status(200).json({message: "Sesion iniciada", accessToken, user: req.session.user})

    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message })

    }
}

export const Logout = async (req, res)=>{
    req.session.destroy((err)=>{
        if(err) return res.status(500).json({message:"Error al cerrar sesion"})
        res.clearCookie("connect.sid")
        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")
        res.status(200).json({ message: "Sesion cerrada" })
    })
}