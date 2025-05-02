import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format, subMonths, startOfMonth, endOfMonth, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import type { OrdenMantenimiento } from '../../types'

interface MantenimientosPorMesChartProps {
  ordenes: OrdenMantenimiento[]
}

export const MantenimientosPorMesChart = ({ ordenes }: MantenimientosPorMesChartProps) => {
  // Preparar datos para los últimos 6 meses
  const ahora = new Date()
  const datosPorMes = Array.from({ length: 6 }, (_, i) => {
    const mes = subMonths(ahora, i)
    const inicio = startOfMonth(mes)
    const fin = endOfMonth(mes)
    const nombreMes = format(mes, 'MMM', { locale: es })
    
    const preventivos = ordenes.filter(
      orden => 
        orden.tipo === 'preventivo' && 
        parseISO(orden.fecha_solicitud) >= inicio && 
        parseISO(orden.fecha_solicitud) <= fin
    ).length
    
    const correctivos = ordenes.filter(
      orden => 
        orden.tipo === 'correctivo' && 
        parseISO(orden.fecha_solicitud) >= inicio && 
        parseISO(orden.fecha_solicitud) <= fin
    ).length
    
    return {
      name: nombreMes,
      preventivos,
      correctivos,
    }
  }).reverse()

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={datosPorMes}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="preventivos" name="Preventivos" fill="#2196f3" />
        <Bar dataKey="correctivos" name="Correctivos" fill="#f50057" />
      </BarChart>
    </ResponsiveContainer>
  )
}
