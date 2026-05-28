import mongoose from 'mongoose'
import { env } from './env.js'


export default async function connectDb(){
    try {
        await mongoose.connect(env.db_url)
        console.log("conexion establecida")
    } catch (error) {
        console.error(`Error al conectarse a la db: ${error.message}`)
    }
}