import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
} from '@mui/material'
import {
  Build as BuildIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Timeline as TimelineIcon,
  MonetizationOn as MonetizationOnIcon,
} from '@mui/icons-material'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { conservadoresService } from '../../services/supabase/conservadoresService'
import { mantenimientoService } from '../../services/supabase/mantenimientoService'
import { EstadisticasChart } from './EstadisticasChart'
import { MantenimientosPorMesChart } from './MantenimientosPorMesChart'
import type { Conservador, OrdenMantenimiento } from '../../types'

export const Dashboard = () => {
  const [conservadores, setConservadores] = useState<Conservador[]>([])
  const [ordenes, setOrdenes] = useState<OrdenMantenimiento[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [conservadoresData, ordenesData] = await Promise.all([
          conservadoresService.getConservadores(),
          mantenimientoService.getOrdenes(),
        ])
        setConservadores(conservadoresData)
        setOrdenes(ordenesData)
      } catch (error) {
        console.error('Error al cargar datos para el dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calcular estadísticas
  const estadisticasConservadores = {
    total: conservadores.length,
    activos: conservadores.filter(c => c.estado === 'activo').length,
    mantenimiento: conservadores.filter(c => c.estado === 'mantenimiento').length,
    inactivos: conservadores.filter(c => c.estado === 'inactivo').length,
  }

  const estadisticasOrdenes = {
    total: ordenes.length,
    pendientes: ordenes.filter(o => o.estado === 'pendiente').length,
    enProceso: ordenes.filter(o => o.estado === 'en_proceso').length,
    completadas: ordenes.filter(o => o.estado === 'completado').length,
    preventivas: ordenes.filter(o => o.tipo === 'preventivo').length,
    correctivas: ordenes.filter(o => o.tipo === 'correctivo').length,
    costoTotal: ordenes.reduce((sum, orden) => sum + (orden.costo || 0), 0),
  }

  // Próximos mantenimientos (ordenados por fecha_servicio)
  const proximosMantenimientos = ordenes
    .filter(orden => orden.estado !== 'completado' && orden.fecha_servicio)
    .sort((a, b) => new Date(a.fecha_servicio).getTime() - new Date(b.fecha_servicio).getTime())
    .slice(0, 5)

  if (loading) {
    return <div>Cargando dashboard...</div>
  }

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Control
      </Typography>

      {/* Tarjetas de Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#e8f5e9',
            }}
          >
            <Typography color="textSecondary" gutterBottom variant="overline">
              CONSERVADORES ACTIVOS
            </Typography>
            <Typography color="textPrimary" variant="h4">
              {estadisticasConservadores.activos}
            </Typography>
            <Typography variant="caption" sx={{ mt: 1 }}>
              De un total de {estadisticasConservadores.total} conservadores
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#fff3e0',
            }}
          >
            <Typography color="textSecondary" gutterBottom variant="overline">
              MANTENIMIENTOS PENDIENTES
            </Typography>
            <Typography color="textPrimary" variant="h4">
              {estadisticasOrdenes.pendientes}
            </Typography>
            <Typography variant="caption" sx={{ mt: 1 }}>
              {estadisticasOrdenes.enProceso} en proceso
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#f3e5f5',
            }}
          >
            <Typography color="textSecondary" gutterBottom variant="overline">
              MANTENIMIENTOS COMPLETADOS
            </Typography>
            <Typography color="textPrimary" variant="h4">
              {estadisticasOrdenes.completadas}
            </Typography>
            <Typography variant="caption" sx={{ mt: 1 }}>
              De un total de {estadisticasOrdenes.total} mantenimientos
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#e1f5fe',
            }}
          >
            <Typography color="textSecondary" gutterBottom variant="overline">
              INGRESOS TOTALES
            </Typography>
            <Typography color="textPrimary" variant="h4">
              ${estadisticasOrdenes.costoTotal.toLocaleString('es-MX')}
            </Typography>
            <Typography variant="caption" sx={{ mt: 1 }}>
              De {estadisticasOrdenes.total} órdenes de servicio
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Gráficos y Listas */}
      <Grid container spacing={3}>
        {/* Gráfico de Estado de Conservadores */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Estado de Conservadores" />
            <Divider />
            <CardContent>
              <Box height={300}>
                <EstadisticasChart 
                  data={[
                    { name: 'Activos', value: estadisticasConservadores.activos, color: '#4caf50' },
                    { name: 'Mantenimiento', value: estadisticasConservadores.mantenimiento, color: '#ff9800' },
                    { name: 'Inactivos', value: estadisticasConservadores.inactivos, color: '#f44336' },
                  ]}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Mantenimientos por Mes */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Mantenimientos por Mes" />
            <Divider />
            <CardContent>
              <Box height={300}>
                <MantenimientosPorMesChart ordenes={ordenes} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Próximos Mantenimientos */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Próximos Mantenimientos" />
            <Divider />
            <CardContent>
              {proximosMantenimientos.length > 0 ? (
                <List>
                  {proximosMantenimientos.map((orden) => (
                    <ListItem
                      key={orden.id}
                      sx={{ 
                        borderLeft: 4, 
                        borderColor: orden.tipo === 'preventivo' ? 'primary.main' : 'secondary.main',
                        mb: 1,
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        borderRadius: 1
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: orden.tipo === 'preventivo' ? 'primary.main' : 'secondary.main' }}>
                          <BuildIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <>
                            {orden.conservador.numero_serie}
                            <Chip
                              size="small"
                              label={orden.tipo}
                              color={orden.tipo === 'preventivo' ? 'primary' : 'secondary'}
                              sx={{ ml: 1 }}
                            />
                          </>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              {orden.conservador.cliente.nombre}
                            </Typography>
                            <Typography variant="body2" component="div">
                              Fecha: {format(new Date(orden.fecha_servicio), 'dd/MM/yyyy', { locale: es })}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No hay mantenimientos programados próximamente.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Resumen de Tipos y Estados */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Resumen de Mantenimientos" />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Por Tipo
                  </Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <TimelineIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Preventivos: {estadisticasOrdenes.preventivas}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <BuildIcon color="secondary" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Correctivos: {estadisticasOrdenes.correctivas}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Por Estado
                  </Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <WarningIcon color="warning" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Pendientes: {estadisticasOrdenes.pendientes}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <TimelineIcon color="info" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      En proceso: {estadisticasOrdenes.enProceso}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Completados: {estadisticasOrdenes.completadas}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" alignItems="center" justifyContent="center">
                <MonetizationOnIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="subtitle1">
                  Ingreso promedio por mantenimiento: ${estadisticasOrdenes.total > 0 
                    ? (estadisticasOrdenes.costoTotal / estadisticasOrdenes.total).toFixed(2)
                    : '0.00'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
