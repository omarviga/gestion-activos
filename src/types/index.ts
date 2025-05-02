export interface Conservador {
    id: string
    numero_serie: string
    capacidad: number
    ubicacion: {
        lat: number
        lng: number
    }
    estado: 'activo' | 'mantenimiento' | 'inactivo'
    cliente_id: string
    qr_code: string
    ultima_revision: Date
}

export interface Cliente {
    id: string
    nombre: string
    direccion: string
    contacto: {
        nombre: string
        telefono: string
        email: string
    }
    conservadores: Conservador[]
}

export interface OrdenMantenimiento {
    id: string
    conservador_id: string
    fecha_solicitud: Date
    fecha_servicio: Date
    tipo: 'preventivo' | 'correctivo'
    descripcion: string
    estado: 'pendiente' | 'en_proceso' | 'completado'
    costo: number
}