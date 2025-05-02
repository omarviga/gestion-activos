import { useState, useEffect, ChangeEvent } from 'react'
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Avatar
} from '@mui/material'
import { Upload as UploadIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material'
import { tecnicosService } from '../../services/supabase/tecnicosService'
import type { Tecnico } from '../../types'

interface TecnicoFormProps {
  tecnico: Tecnico | null
  onSave: (tecnico: Tecnico | Omit<Tecnico, 'id'>) => void
  onCancel: () => void
}

export const TecnicoForm = ({ tecnico, onSave, onCancel }: TecnicoFormProps) => {
  const initialFormState: Omit<Tecnico, 'id'> = {
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    email: '',
    especialidad: '',
    fecha_contratacion: new Date().toISOString().split('T')[0],
    estado: 'activo',
    foto_url: ''
  }

  const [formData, setFormData] = useState<any>(initialFormState)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  useEffect(() => {
    if (tecnico) {
      setFormData({
        ...tecnico,
        fecha_contratacion: tecnico.fecha_contratacion.split('T')[0]
      })
      setPreviewUrl(tecnico.foto_url || '')
    } else {
      setFormData(initialFormState)
      setPreviewUrl('')
    }
  }, [tecnico])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }))

    // Limpiar errores cuando el usuario modifica un campo
    if (errors[name as string]) {
      setErrors(prev => ({
        ...prev,
        [name as string]: ''
      }))
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      
      // Crear una URL para previsualizar la imagen
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio'
    }
    
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es obligatorio'
    }
    
    if (!formData.cedula.trim()) {
      newErrors.cedula = 'La cédula es obligatoria'
    }
    
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      let fotoUrl = formData.foto_url || ''
      
      // Si hay un archivo seleccionado y es una actualización (tiene ID) o es un nuevo técnico
      if (selectedFile) {
        // Para actualizar, necesitamos el ID existente
        const tecnicoId = tecnico?.id || 'temp_' + Date.now()
        fotoUrl = await tecnicosService.uploadFoto(selectedFile, tecnicoId)
      }
      
      const tecnicoData = {
        ...formData,
        foto_url: fotoUrl
      }
      
      onSave(tecnicoData)
    } catch (error) {
      console.error('Error al guardar el técnico:', error)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Foto del Técnico
          </Typography>
          <Avatar
            src={previewUrl}
            alt="Vista previa"
            sx={{ width: 150, height: 150, mb: 2 }}
          />
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadIcon />}
          >
            Subir Foto
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Información Personal
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                error={!!errors.apellido}
                helperText={errors.apellido}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Cédula"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                error={!!errors.cedula}
                helperText={errors.cedula}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                error={!!errors.telefono}
                helperText={errors.telefono}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            Información Laboral
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Especialidad"
                name="especialidad"
                value={formData.especialidad}
                onChange={handleChange}
                error={!!errors.especialidad}
                helperText={errors.especialidad}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Fecha de Contratación"
                name="fecha_contratacion"
                type="date"
                value={formData.fecha_contratacion}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.fecha_contratacion}
                helperText={errors.fecha_contratacion}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="estado-label">Estado</InputLabel>
                <Select
                  labelId="estado-label"
                  name="estado"
                  value={formData.estado}
                  label="Estado"
                  onChange={handleChange}
                  error={!!errors.estado}
                >
                  <MenuItem value="activo">Activo</MenuItem>
                  <MenuItem value="inactivo">Inactivo</MenuItem>
                  <MenuItem value="vacaciones">Vacaciones</MenuItem>
                </Select>
                {errors.estado && <FormHelperText error>{errors.estado}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          onClick={onCancel}
          startIcon={<CancelIcon />}
          sx={{ mr: 1 }}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
        >
          Guardar
        </Button>
      </Box>
    </Box>
  )
}
