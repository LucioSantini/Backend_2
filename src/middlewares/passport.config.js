import passport from "passport";
import userModel from "../models/user.model.js";
import {Strategy as GitHubStrategy} from 'passport-github2'
import {Strategy as LocalStrategy} from 'passport-local'
import {Strategy as JwtStrategy,ExtractJwt} from 'passport-jwt'
import { env } from "../config/env.js";
import { hashPassword } from "../utils/auth.js";

const {client_id, client_secret, callback_url} = env.github

const initializePassport = ()=>{
    // estrategia de local de registro
    passport.use

    // estrategia de JWT

    passport.use('jwt',new JwtStrategy({
        jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: env.jwt_secret
    }, async(jwt_payload, done)=>{
       try {
        const userId= jwt_payload.id || jwt_payload._id
        const user = await userModel.findById(userId).select("-password")

        if(!user)return done(null, false)

        return done(null, user)

       } catch (error) {
        return done(error)
       } 
    }))


    passport.use('register', new LocalStrategy({
            usernameField: "email",
            passReqToCallback: true,
        }, async(req, email, password, done)=>{
            try {

                let userRole = "user"
                if(email === "admin@email.com"){
                    userRole = "admin"
                }

                const user = await userModel.findOne({email})
                if(user)return done(null, false, {message:"El usuario ya existe"})
                const passHash = await hashPassword(password)
                const newUser = await userModel.create({email, password:passHash, role:userRole})

                return done(null, newUser)
            } catch (error) {
                return done(error)
            }
        }
    ))


    // estrategia de github
    passport.use(
        'github',
        new GitHubStrategy({
            clientID: client_id,
            clientSecret: client_secret,
            callbackURL: callback_url
        }, async (accessToken, refreshToken, profile, done)=>{
            try {
                
                const email = profile._json.email || `${profile.username}@github.com`
                console.log(profile.emails)
                console.log(profile._json.email)
                let user = await userModel.findOne({email})
                if(!user){
                    user = await userModel.create({
                        email: email,
                        password:'password123'
                    })

                }
                return done(null, user)

            } catch (error) {
                return done(error)
            }
        })
    )

    passport.serializeUser((user, done)=>{
        done(null,user._id)
    })

    passport.deserializeUser(async(id, done)=>{
        try {
            const user = await userModel.findById(id).select("-password")
            done(null, user)
        } catch (error) {
            done(error,null)
        }
    })

}



export default initializePassport