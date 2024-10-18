import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { check } from 'express-validator'
import multer from 'multer'
import {
    createEmpleado,
    updateEmpleado,
    deleteEmpleado,
    getAllEmpleados,
    getEmpleadoById,
    getEmpleadoByUsername,
    getEmpleadoByRol
} from '../controllers/empleadoController.js'

const upload = multer({ storage: multer.memoryStorage() })
const router = express.Router()

router.post(
    '/create',
    //authMiddleware, // Aquí agregas el middleware de autenticación
    upload.single('imagen'),
    [
        check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
        check('usuario').notEmpty().withMessage('El usuario es obligatorio'),
        check('password')
            .isLength({ min: 6 })
            .withMessage('La contraseña debe tener mínimo 6 caracteres')
    ],
    createEmpleado
)

router.put(
    '/update/:id',
    authMiddleware,
    upload.single('imagen'),
    updateEmpleado
)

router.delete(
    '/delete/:id',
    authMiddleware,
    deleteEmpleado
)

router.get(
    '/',
    authMiddleware,
    getAllEmpleados
)

router.get(
    '/empleado/:id',
    authMiddleware,
    getEmpleadoById
)

router.get(
    '/rol/:rol',
    authMiddleware,
    getEmpleadoByRol
)

router.get(
    '/usuario/:usuario',
    authMiddleware,
    getEmpleadoByUsername
)

export default router
