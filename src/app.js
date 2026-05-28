import express from "express"
import cookieParser from "cookie-parser"
import handlebars from "express-handlebars"
import session from "express-session"
import __dirname from "./utils.js"
import viewRouter from "./routes/view.routes.js"
import FileStore from "session-file-store"
import dotenv from "dotenv"
import MongoStore from "connect-mongo"
import connectDb from "./config/db.js"
import userRoutes from "./routes/user.routes.js"
import authRoutes from "./routes/auth.routes.js"
import initializePassport from "./middlewares/passport.config.js"
import path from "path"
dotenv.config()
import { env } from "./config/env.js"
import passport from "passport"
console.log(env)

// const USER = "Lucio"
// const PASS = "Locolucio2"

const secret = process.env.SECRET

const fileStore = FileStore(session)

const app = express()

app.set("PORT", env.port)
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + "/public"))
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")


// app.use(session({
//     store: new fileStore({path:'./sessions', ttl:100, retries:0}),
//     secret,
//     resave:false,
//     saveUninitialized: false
// }))

app.use(session({
    store: MongoStore.create({
        mongoUrl:process.env.DB_URL,
        ttl:60000,
    }),
    secret,
    resave:false,
    saveUninitialized: false
}))

connectDb()
app.listen(app.get("PORT"),() =>{
    console.log("Servidor Activo: " + app.get("PORT"))
})

app.use(cookieParser("K0d16oC0d3r"))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())


// app.get("/setCookie", (req, res) =>{
//     res.cookie("CoderCookie", "una cookie de chips de chocolate", {maxAge:20000}).send("Cookie Creada!")
// })

// app.get("/getCookie", (req, res) =>{
//     res.send(req.cookies)
// })

// app.get("/deleteCookie", (req, res) =>{
//     res.clearCookie("CoderCookie").send("Cookie eliminada")
// })

// app.get("/setSignedCookie", (req, res) =>{
//     res.cookie("CoderSignedCookie", "una cookie de chips de chocolate con seguridad", {maxAge:20000, signed:true}).send("Cookie Creada!")
// })

// app.get("/getSignedCookie", (req, res) =>{
//     res.send(req.signedCookies)
// })
const auth = (req, res, next) =>{
    if(req.query.usuario == USER && req.query.contrasena == PASS) {
        next()
    }

    res.status(400).json({status:"error", message:"usuario y contraseña invalidos"})
}

// app.get("/session", (req, res) => {
//     if (req.session.contador) {
//         req.session.contador++
//         res.send("se ha visitado " + req.session.contador + " veces el Sitio Web")
//     } else {
//         req.session.contador = 1
//         res.send("bienvenido")
//     }
// })

// app.get("/logout", (req, res) => {
//     req.session.destroy(error =>{
//         if (error) {
//             res.status(400).send("error hubo un problema en el cierre de sesion")
//         } else {
//             res.send("Sesion finalizada")
//         }
//     })
// })

// app.get("/login", auth, (req, res) =>{
//     const {usuario, contrasena} = req.query
//     req.session.usuario = usuario
//     req.session.contrasena = contrasena
//     // res.send("Datos del usuario almacenados")
//     res.json({"status":"ok"})
// })

// app.get("/profile", (req, res) => {
//     const usuario = req.session.usuario
//     const contrasena = req.session.contrasena
//     res.send({usuario, contrasena})
// })

// app.get("/privado", auth, (req, res) =>{
//     res.send("Estas accediendo al contenido Premium")
// })

app.use("/view", viewRouter)
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", userRoutes)