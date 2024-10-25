import { db } from '../config/firebase.js';
import EmpleadoModel from '../models/EmpleadoModel.js';

class EmpleadoRepository {
    async createEmpleado(data) {
        const empleado = await db.collection('empleados_computo').add({
            nombre: data.nombre,
            apaterno: data.apaterno,
            amaterno: data.amaterno,
            direccion: data.direccion,
            telefono: data.telefono,
            ciudad: data.ciudad,
            estado: data.estado,
            usuario: data.usuario,
            password: data.password,
            rol: data.rol,
            imagen: data.imagen
        });
        return empleado.id;
    }

    async updateEmpleado(id, data) {
        await db.collection('empleados_computo').doc(id).update(data);
    }

    async deleteEmpleado(id) {
        await db.collection('empleados_computo').doc(id).delete();
    }

    async getAllEmpleados() {
        const docs = await db.collection('empleados_computo').get();
        const empleados = [];
        docs.forEach((doc) => {
            const data = doc.data();
            empleados.push(new EmpleadoModel(
                doc.id,
                data.nombre,
                data.apaterno,
                data.amaterno,
                data.direccion,
                data.telefono,
                data.ciudad,
                data.estado,
                data.usuario,
                data.password,
                data.rol,
                data.imagen
            ));
        });
        return empleados;
    }

    async getAllEmpleadoById(id) {
        const doc = await db.collection('empleados_computo').doc(id).get();

        if (!doc.exists) {
            return null;
        }

        const data = doc.data();
        return new EmpleadoModel(
            doc.id,
            data.nombre,
            data.apaterno,
            data.amaterno,
            data.direccion,
            data.telefono,
            data.ciudad,
            data.estado,
            data.usuario,
            data.password,
            data.rol,
            data.imagen
        );
    }

    async getAllEmpleadoByUsername(usuario) {
        const empleadoQuery = await db.collection('empleados_computo').where('usuario', '==', usuario).get();
        if (empleadoQuery.empty) {
            return null;
        }

        const doc = empleadoQuery.docs[0];
        const data = doc.data();
        return new EmpleadoModel(
            doc.id,
            data.nombre,
            data.apaterno,
            data.amaterno,
            data.direccion,
            data.telefono,
            data.ciudad,
            data.estado,
            data.usuario,
            data.password,
            data.rol,
            data.imagen
        );
    }

    async getAllEmpleadoByRol(rol) {
        const docs = await db.collection('empleados_computo').where('rol', '==', rol).get();
        const empleados = [];
        docs.forEach((doc) => {
            const data = doc.data();
            empleados.push(new EmpleadoModel(
                doc.id,
                data.nombre,
                data.apaterno,
                data.amaterno,
                data.direccion,
                data.telefono,
                data.ciudad,
                data.estado,
                data.usuario,
                data.password,
                data.rol,
                data.imagen
            ));
        });
        return empleados;
    }
}

export default EmpleadoRepository;
