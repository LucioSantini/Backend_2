import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export const generateTokens =(user)=>{
    const accessToken = jwt.sign({id: user._id, email: user.email, role: user.role}, env.jwt_secret, {expiresIn:"1h"})
    const refreshToken = jwt.sign({id: user.id}, env.session_secret, {expiresIn:"7d"})

    return {accessToken,refreshToken}
}


export const verifyAccessToken= (token)=> jwt.verify(token, env.jwt_secret)
export const verifyRefreshToken= (token)=> jwt.verify(token, env.session_secret)