import { supabase } from './client'
import type { Conservador } from '../../types'

export const conservadoresService = {
    async getConservadores() {
        const { data, error } = await supabase
            .from('conservadores')
            .select(`
        *,
        cliente:clientes (
          id,
          nombre,
          telefono
        )
      `)
            .order('numero_serie')

        if (error) throw error
        return data
    },

    async createConservador(conservador: Omit<Conservador, 'id'>) {
        const { data, error } = await supabase
            .from('conservadores')
            .insert(conservador)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async updateConservador(id: string, conservador: Partial<Conservador>) {
        const { data, error } = await supabase
            .from('conservadores')
            .update(conservador)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async deleteConservador(id: string) {
        const { error } = await supabase
            .from('conservadores')
            .delete()
            .eq('id', id)

        if (error) throw error
    }
}