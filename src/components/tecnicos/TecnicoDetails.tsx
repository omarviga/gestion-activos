import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tooltip,
  Typography
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Engineering as EngineeringIcon,
  CalendarMonth as CalendarIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Build as BuildIcon
} from '@mui/icons-material'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { tecnicosService } from '../../services/supabase/tecnicosService'
import type { Tecnico, OrdenMantenimiento } from '../../types'
import { TecnicoForm } from './TecnicoForm'

export const TecnicoDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [tecnico, setTecnico] = useState<Tecnico & { ordenes_mantenimiento?: OrdenMantenimiento[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [openForm, setOpenForm] = useState(false)

  useEffect(() => {
    const fetchTecnico = async () => {
      try {
        setLoading(true)
        if (id) {
          const data = await tecnicosService.getTecnicoById(id)
          setTecnico(data)
        }
      } catch (error) {
        console.error('Error al obtener detalles del técnico:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTecnico()
  }, [id])

  const handleOpenForm = () => {
    setOpenForm(true)
  }

  const handleCloseForm = () => {
    setOpenForm(false)
  }

  const handleSaveTecnico = async (updatedTecnico: Tecnico) => {
    try {
      await tecnicosService.updateTecnico(updatedTecnico.id, updatedTecnico)
      // Actualizar el estado con los nuevos datos
      setTecnico(prev => ({ ...prev, ...updatedTecnico }))
      handleCloseForm()
    } catch (error) {
      console.error('Error al actualizar técnico:', error)
    }
  }

  const getChipColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'success'
      case 'inactivo':
        return 'error'
      case 'vacaciones':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getChipColorOrden = (estado: string) => {
    switch (estado) {
      case 'completado':
        return 'success'
      case 'en_proceso':
        return 'warning'
      case 'pendiente':
        return 'info'
      case 'cancelado':
        return 'error'
      default:
        return 'default'
    }
  }

  if (loading) {
    return <Container maxWidth="lg"><Typography>Cargando detalles del técnico...</Typography></Container>
  }

  if (!tecnico) {
    return (
      <Container maxWidth="lg">
        <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Técnico no encontrado
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/tecnicos')}
            sx={{ mt: 2 }}
          >
            Volver a la lista de técnicos
          </Button>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={4}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          component={RouterLink}
          to="/tecnicos"
          sx={{ mr: 2 }}
        >
          Volver
        </Button>
        <Typography variant="h4" component="h1">
          Detalles del Técnico
        </Typography>
        <Box flexGrow={1} />
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleOpenForm}
        >
          Editar
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
              <Avatar
                src={tecnico.foto_url}
                alt={`${tecnico.nombre} ${tecnico.apellido}`}
                sx={{ width: 150, height: 150, mb: 2 }}
              >
                {tecnico.nombre.charAt(0)}
              </Avatar>
              <Typography variant="h5" align="center" gutterBottom>
                {tecnico.nombre} {tecnico.apellido}
              </Typography>
              <Chip
                label={tecnico.estado}
                color={getChipColor(tecnico.estado) as any}
                sx={{ mb: 2 }}
              />
              <Typography variant="body1" align="center" color="textSecondary" gutterBottom>
                {tecnico.especialidad}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información de Contacto
              </Typography>
              <List disablePadding>
                <ListItem sx={{ px: 0 }}>
                  <PhoneIcon sx={{ mr: 2, color: 'action.active' }} />
                  <ListItemText
                    primary="Teléfono"
                    secondary={tecnico.telefono}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <EmailIcon sx={{ mr: 2, color: 'action.active' }} />
                  <ListItemText
                    primary="Email"
                    secondary={tecnico.email}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <BadgeIcon sx={{ mr: 2, color: 'action.active' }} />
                  <ListItemText
                    primary="Cédula"
                    secondary={tecnico.cedula}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <CalendarIcon sx={{ mr: 2, color: 'action.active' }} />
                  <ListItemText
                    primary="Fecha de Contratación"
                    secondary={format(new Date(tecnico.fecha_contratacion), 'dd MMMM yyyy', { locale: es })}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <EngineeringIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">
                  Historial de Servicios
                </Typography>
              </Box>
              
              {tecnico.ordenes_mantenimiento && tecnico.ordenes_mantenimiento.length > 0 ? (
                <List>
                  {tecnico.ordenes_mantenimiento.map((orden) => (
                    <Paper key={orden.id} sx={{ mb: 2, p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={8}>
                          <Typography variant="subtitle1">
                            Conservador: {orden.conservador.modelo} ({orden.conservador.serie})
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Fecha de servicio: {format(new Date(orden.fecha_servicio), 'dd/MM/yyyy', { locale: es })}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Tipo: {orden.tipo === 'preventivo' ? 'Mantenimiento Preventivo' : 'Reparación Correctiva'}
                          </Typography>
                          {orden.diagnostico && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              <strong>Diagnóstico:</strong> {orden.diagnostico}
                            </Typography>
                          )}
                          {orden.solucion && (
                            <Typography variant="body2">
                              <strong>Solución:</strong> {orden.solucion}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box display="flex" flexDirection="column" alignItems="flex-end">
                            <Chip
                              label={orden.estado.replace('_', ' ')}
                              color={getChipColorOrden(orden.estado) as any}
                              size="small"
                              sx={{ mb: 1 }}
                            />
                            {orden.costo && (
                              <Typography variant="body1" fontWeight="bold">
                                ${orden.costo.toFixed(2)}
                              </Typography>
                            )}
                            <Button
                              size="small"
                              component={RouterLink}
                              to={`/mantenimiento/${orden.id}`}
                              sx={{ mt: 1 }}
                            >
                              Ver detalles
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </List>
              ) : (
                <Box textAlign="center" py={4}>
                  <BuildIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary">
                    Sin órdenes de servicio
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Este técnico aún no ha realizado servicios de mantenimiento
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modal para editar técnico */}
      <TecnicoForm
        tecnico={tecnico}
        onSave={handleSaveTecnico}
        onCancel={handleCloseForm}
        openForm={openForm}
      />
    </Container>
  )
}
