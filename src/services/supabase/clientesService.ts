import { supabase } from './client'
import type { Cliente } from '../../types'

export const clientesService = {
    async getClientes() {
        const { data, error } = await supabase
            .from('clientes')
            .select(`
        *,
        conservadores (
          id,
          numero_serie,
          capacidad,
          estado
        )
      `)
            .order('nombre')

        if (error) throw error
        return data
    },

    async createCliente(cliente: Omit<Cliente, 'id'>) {
        const { data, error } = await supabase
            .from('clientes')
            .insert(cliente)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async updateCliente(id: string, cliente: Partial<Cliente>) {
        const { data, error } = await supabase
            .from('clientes')
            .update(cliente)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async deleteCliente(id: string) {
        const { error } = await supabase
            .from('clientes')
            .delete()
            .eq('id', id)

        if (error) throw error
    }
}