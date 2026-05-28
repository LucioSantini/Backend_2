import userModel from "../models/user.model.js";


export const getAll = async(req, res) =>{
   try {
        const users = await userModel.find()
        res.status(200).json({message: "lista de usuarios", payload: users})
   } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message})
   }
}

export const create = async(req, res) =>{
    
   try {
        res.status(201).json({message: "usuario creado correctamente", payload: req.user})
   } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message})
   }
}

export const getProfile = async(req, res) => {
    try {
     //    const user = req.session?.user
     //    if (!user) return res.status(401).json({message: "Debes iniciar sesion primero"})
     //      res.status(200).json({ message: "lista de usuarios", payload: user })
        res.status(200).json({ message: "lista de usuarios", payload: req.user })
    } catch (error) {
        res.status(500).json({ message: "error interno del servidor", error: error.message })
    }
}

export const DeleteAccount = async (req, res)=>{
     try {
          const user = await userModel.findByIdAndDelete(req.params.id)
          if(!user) return res.status(404).json({ message: "Usuario no encontrado"})
          res.json({ message: "Usuario eliminado exitosamente"})
     } catch (error) {
          res.status(500).json({ error: "Error al eliminar" })
     }
}