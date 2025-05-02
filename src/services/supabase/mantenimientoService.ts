import { supabase } from './client'
import type { OrdenMantenimiento } from '../../types'

export const mantenimientoService = {
    async getOrdenes() {
        const { data, error } = await supabase
            .from('ordenes_mantenimiento')
            .select(`
        *,
        conservador:conservadores (
          id,
          numero_serie,
          modelo,
          cliente:clientes (
            id,
            nombre,
            telefono
          )
        )
      `)
            .order('fecha_solicitud', { ascending: false })

        if (error) throw error
        return data
    },

    async createOrden(orden: Omit<OrdenMantenimiento, 'id'>) {
        const { data, error } = await supabase
            .from('ordenes_mantenimiento')
            .insert(orden)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async updateOrden(id: string, orden: Partial<OrdenMantenimiento>) {
        const { data, error } = await supabase
            .from('ordenes_mantenimiento')
            .update(orden)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async deleteOrden(id: string) {
        const { error } = await supabase
            .from('ordenes_mantenimiento')
            .delete()
            .eq('id', id)

        if (error) throw error
    }
}