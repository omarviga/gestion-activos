import { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon
} from '@mui/icons-material'
import { tecnicosService } from '../../services/supabase/tecnicosService'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Tecnico } from '../../types'
import { TecnicoForm } from './TecnicoForm'

export const TecnicosList = () => {
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([])
  const [filteredTecnicos, setFilteredTecnicos] = useState<Tecnico[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [openForm, setOpenForm] = useState(false)
  const [currentTecnico, setCurrentTecnico] = useState<Tecnico | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tecnicoToDelete, setTecnicoToDelete] = useState<Tecnico | null>(null)

  const fetchTecnicos = async () => {
    try {
      setLoading(true)
      const data = await tecnicosService.getTecnicos()
      setTecnicos(data)
      setFilteredTecnicos(data)
    } catch (error) {
      console.error('Error al obtener la lista de técnicos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTecnicos()
  }, [])

  useEffect(() => {
    const filtered = tecnicos.filter(
      tecnico =>
        tecnico.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tecnico.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tecnico.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tecnico.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredTecnicos(filtered)
  }, [searchTerm, tecnicos])

  const handleOpenForm = (tecnico?: Tecnico) => {
    if (tecnico) {
      setCurrentTecnico(tecnico)
    } else {
      setCurrentTecnico(null)
    }
    setOpenForm(true)
  }

  const handleCloseForm = () => {
    setOpenForm(false)
    setCurrentTecnico(null)
  }

  const handleSaveTecnico = async (tecnico: Tecnico | Omit<Tecnico, 'id'>) => {
    try {
      if ('id' in tecnico) {
        await tecnicosService.updateTecnico(tecnico.id, tecnico)
      } else {
        await tecnicosService.createTecnico(tecnico)
      }
      fetchTecnicos()
      handleCloseForm()
    } catch (error) {
      console.error('Error al guardar técnico:', error)
    }
  }

  const openDeleteDialog = (tecnico: Tecnico) => {
    setTecnicoToDelete(tecnico)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!tecnicoToDelete) return
    
    try {
      await tecnicosService.deleteTecnico(tecnicoToDelete.id)
      fetchTecnicos()
    } catch (error) {
      console.error('Error al eliminar técnico:', error)
    } finally {
      setDeleteDialogOpen(false)
      setTecnicoToDelete(null)
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

  if (loading) {
    return <div>Cargando técnicos...</div>
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          Técnicos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Nuevo Técnico
        </Button>
      </Box>

      <Paper sx={{ mb: 2, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Buscar técnicos"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" justifyContent="flex-end">
              <Typography>
                {filteredTecnicos.length} técnicos encontrados
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {filteredTecnicos.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Foto</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Cédula</TableCell>
                <TableCell>Especialidad</TableCell>
                <TableCell>Contacto</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha Contratación</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTecnicos.map((tecnico) => (
                <TableRow key={tecnico.id}>
                  <TableCell>
                    <Avatar
                      src={tecnico.foto_url}
                      alt={`${tecnico.nombre} ${tecnico.apellido}`}
                      sx={{ width: 40, height: 40 }}
                    >
                      {tecnico.nombre.charAt(0)}
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      {tecnico.nombre} {tecnico.apellido}
                    </Typography>
                  </TableCell>
                  <TableCell>{tecnico.cedula}</TableCell>
                  <TableCell>{tecnico.especialidad}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{tecnico.telefono}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {tecnico.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={tecnico.estado} 
                      color={getChipColor(tecnico.estado) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(tecnico.fecha_contratacion), 'dd/MM/yyyy', { locale: es })}
                  </TableCell>
                  <TableCell align="center">
                    <Box>
                      <Tooltip title="Ver detalles">
                        <IconButton
                          component={RouterLink}
                          to={`/tecnicos/${tecnico.id}`}
                          color="info"
                          size="small"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleOpenForm(tecnico)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => openDeleteDialog(tecnico)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No se encontraron técnicos
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Intente con diferentes términos de búsqueda o agregue un nuevo técnico
          </Typography>
        </Paper>
      )}

      {/* Formulario de Técnico */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentTecnico ? 'Editar Técnico' : 'Nuevo Técnico'}
        </DialogTitle>
        <DialogContent>
          <TecnicoForm
            tecnico={currentTecnico}
            onSave={handleSaveTecnico}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea eliminar al técnico {tecnicoToDelete?.nombre} {tecnicoToDelete?.apellido}?
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
