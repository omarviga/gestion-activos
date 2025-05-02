export interface OrdenMantenimiento {
    id: string;
    fecha_solicitud: string;
    fecha_servicio: string;
    estado: 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';
    tipo: 'preventivo' | 'correctivo';
    diagnostico?: string;
    solucion?: string;
    conservador_id: string;
    costo?: number;
    tecnico_id?: string;
    conservador: Conservador;
    tecnico?: Tecnico;
}

export interface Tecnico {
    id: string;
    nombre: string;
    apellido: string;
    cedula: string;
    telefono: string;
    email: string;
    especialidad: string;
    fecha_contratacion: string;
    estado: 'activo' | 'inactivo' | 'vacaciones';
    foto_url?: string;
}
