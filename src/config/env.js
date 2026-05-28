import dotenv from "dotenv"
dotenv.config()


export const env={
    port: process.env.PORT || 4000,
    secret: process.env.SECRET,
    db_url: process.env.DB_URL,
    jwt_secret: process.env.JWT_SECRET,
    session_secret: process.env.REFRESH_SECRET,
    github:{
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        callback_url: process.env.GITHUB_CALLBACK_URL 
    }
}