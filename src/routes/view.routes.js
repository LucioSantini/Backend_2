import { Router } from "express";

const viewRouter = Router()

viewRouter.get("/",(req, res) =>{
    res.render("index")
})

viewRouter.get("/principal",(req, res) =>{
    res.render("principal")
})

export default viewRouter