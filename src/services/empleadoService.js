import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'  // Cambiado jws por jwt
import fs from 'fs'
import path from 'path'
import EmpleadoRepository from '../repositories/empleadoRepository.js'
import EmpleadoModel from '../models/EmpleadoModel.js'
import { sendPasswordResetEmail } from '../utils/emailService.js'

const empleadoRepository = new EmpleadoRepository()
const secret = process.env.JWT_SECRET
const saltRound = 10

class EmpleadoService {
    async createEmpleado(data, file) {
        const existsEmpleado = await empleadoRepository.getEmpleadoByUsername(data.username)
        if (existsEmpleado) {
            throw new Error('El username ya existe')
        }
        const hashedPass = await bcrypt.hash(data.password, saltRound)

        const newEmpleado = new EmpleadoModel(
            null,
            data.nombre,
            data.apaterno,
            data.amaterno,
            data.direccion,
            data.telefono,
            data.ciudad,
            data.estado,
            data.username,
            hashedPass,
            data.rol,
            null
        )

        const empleadoId = await empleadoRepository.createEmpleado(newEmpleado)

        if (file) {
            const image = `${empleadoId}_image.png`
            const imagePath = path.join('src', 'userImages', image)
            fs.writeFileSync(imagePath, file.buffer)
            await empleadoRepository.updateEmpleado(empleadoId, { imagen: image })
        }

        return empleadoId
    }

    async updateEmpleado(id, data, file) {
        const existEmpleado = await empleadoRepository.getEmpleadoById(id)
        if (!existEmpleado) {
            throw new Error('Empleado no encontrado')
        }

        if (data.password) {  // Corregido error tipográfico
            data.password = await bcrypt.hash(data.password, saltRound)
        }

        if (file) {
            const image = `${id}_image.png`
            const imagePath = path.join('src', 'userImage', image)
            fs.writeFileSync(imagePath, file.buffer)
            data.image = image
        }

        await empleadoRepository.updateEmpleado(id, data)
    }

    async deleteEmpleado(id) {
        const existEmpleado = await empleadoRepository.getEmpleadoById(id)
        if (!existEmpleado) {
            throw new Error('Empleado no encontrado')
        }
        await empleadoRepository.deleteEmpleado(id)
    }

    async getAllEmpleados() {
        return await empleadoRepository.getAllEmpleados()
    }

    async getEmpleadoById(id) {
        return await empleadoRepository.getEmpleadoById(id)
    }

    async getEmpleadoByUsername(usuario) {  // Corregido el parámetro
        return await empleadoRepository.getEmpleadoByUsername(usuario)
    }

    async getEmpleadoByRol(rol) {
        return await empleadoRepository.getEmpleadoByRol(rol)
    }

    async generatePasswordResetToken(usuario) {
        const existEmpleado = await empleadoRepository.getEmpleadoByUsername(usuario)
        if (!existEmpleado) {
            throw new Error('Usuario no existe')
        }

        const token = jwt.sign({
            id: existEmpleado.id
        }, secret, { expiresIn: '1h' })
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`
        await sendPasswordResetEmail(existEmpleado.usuario, resetUrl)
    }

    async resetPassword(token, newPassword) {
        try {
            const decoded = jwt.verify(token, secret)  // Verificar token correctamente
            const hashedPassword = await bcrypt.hash(newPassword, saltRound)
            await empleadoRepository.updateEmpleado(decoded.id, { password: hashedPassword })
        } catch (error) {
            throw new Error('Token invalido o expirado')
        }
    }
}

export default EmpleadoService
