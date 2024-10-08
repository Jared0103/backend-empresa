import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { getEmpleadoByUsername } from './empleadoController.js';

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await getEmpleadoByUsername(username)
        if (!user) {
            return res.status(401).json({
                error: true,
                message: 'Usuario no encontrado'
            })
        }
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return res.status(401).json({
                error: true,
                message: 'Contraseña incorrecta'
            })
        }
        const token = jwt.sign({
            userId: user.id,
            role: user.role,
        }, process.env.JWT_SECRET, {
            expiresIn: '2h'
        })
        return res.json({ token })

    } catch (error) {
        res.status(401).json({
            error: true,
            message: 'Error: ' + error.message
        })
    }
}

export const logout = (req, res) => {
    res.json({ 
        error: false,
        message: 'Sesion cerrada con exito'
    })
}