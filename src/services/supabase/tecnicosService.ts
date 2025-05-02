import { supabase } from './supabaseClient'
import type { Tecnico, TecnicoStats } from '../../types' // Asegúrate de definir el tipo TecnicoStats

export const tecnicosService = {
  /**
   * Obtiene todos los técnicos ordenados por nombre
   */
  async getTecnicos(): Promise<Tecnico[]> {
    const { data, error } = await supabase
        .from('tecnicos')
        .select('*')
        .order('nombre')

    if (error) {
      console.error('Error al obtener técnicos:', error)
      throw error
    }

    return data || []
  },

  /**
   * Obtiene un técnico específico por ID con sus órdenes de mantenimiento
   */
  async getTecnicoById(id: string): Promise<Tecnico> {
    const { data, error } = await supabase
        .from('tecnicos')
        .select(`
        *,
        ordenes_mantenimiento:ordenes_mantenimiento(*)
      `)
        .eq('id', id)
        .single()

    if (error) {
      console.error(`Error al obtener técnico con ID ${id}:`, error)
      throw error
    }

    return data
  },

  /**
   * Crea un nuevo técnico
   */
  async createTecnico(tecnico: Omit<Tecnico, 'id'>): Promise<Tecnico> {
    const { data, error } = await supabase
        .from('tecnicos')
        .insert([tecnico])
        .select()
        .single()

    if (error) {
      console.error('Error al crear técnico:', error)
      throw error
    }

    return data
  },

  /**
   * Actualiza un técnico existente
   */
  async updateTecnico(id: string, tecnico: Partial<Tecnico>): Promise<Tecnico> {
    const { data, error } = await supabase
        .from('tecnicos')
        .update(tecnico)
        .eq('id', id)
        .select()
        .single()

    if (error) {
      console.error(`Error al actualizar técnico con ID ${id}:`, error)
      throw error
    }

    return data
  },

  /**
   * Elimina un técnico
   */
  async deleteTecnico(id: string): Promise<void> {
    const { error } = await supabase
        .from('tecnicos')
        .delete()
        .eq('id', id)

    if (error) {
      console.error(`Error al eliminar técnico con ID ${id}:`, error)
      throw error
    }
  },

  /**
   * Sube una foto para el técnico y devuelve la URL pública
   */
  async uploadFoto(file: File, tecnicoId: string): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${tecnicoId}.${fileExt}`
    const filePath = `tecnicos/${fileName}`

    const { error: uploadError } = await supabase.storage
        .from('fotos')
        .upload(filePath, file, { upsert: true })

    if (uploadError) {
      console.error('Error al subir la foto:', uploadError)
      throw uploadError
    }

    const { data } = supabase.storage
        .from('fotos')
        .getPublicUrl(filePath)

    return data.publicUrl
  },

  /**
   * Obtiene estadísticas de los técnicos (órdenes completadas)
   * @returns Promise<TecnicoStats[]> - Estadísticas de técnicos activos
   */
  async getTecnicosStats(): Promise<TecnicoStats[]> {
    const { data, error } = await supabase
        .from('tecnicos')
        .select(`
        id,
        nombre,
        apellido,
        ordenes_completadas:ordenes_mantenimiento!tecnico_id(
          count(*),
          tipo
        )
      `)
        .eq('ordenes_mantenimiento.estado', 'completado')
        .eq('estado', 'activo')

    if (error) {
      console.error('Error al obtener estadísticas de técnicos:', error)
      throw error
    }

    return data?.map(tecnico => ({
      ...tecnico,
      // Transformación adicional si es necesaria
    })) || []
  }
}