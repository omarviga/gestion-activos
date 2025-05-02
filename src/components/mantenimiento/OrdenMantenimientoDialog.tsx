import { useEffect, useState } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { conservadoresService } from '../../services/supabase/conservadoresService'
import type { OrdenMantenimiento, Conservador } from '../../types'

interface OrdenMantenimientoDialogProps {
    open: boolean
    orden: OrdenMantenimiento | null
    onClose: () => void
    onSave: (orden: Omit<OrdenMantenimiento, 'id'>) => void
}

export const OrdenMantenimientoDialog = ({
                                             open,
                                             orden,
                                             onClose,
                                             onSave,
                                         }: OrdenMantenimientoDialogProps) => {
    const [conservadores, setConservadores] = useState<Conservador[]>([])
    const [formData, setFormData] = useState({
        conservador_id: '',
        tipo: 'preventivo',
        descripcion: '',
        fecha_solicitud: new Date(),
        fecha_servicio: null as Date | null,
        estado: 'pendiente',
        costo: '',
    })

    useEffect(() => {
        const loadConservadores = async () => {
            try {
                const data = await conservadoresService.getConservadores()
                setConservadores(data)
            } catch (error) {
                console.error('Error al cargar conservadores:', error)
            }
        }
        loadConservadores()
    }, [])

    useEffect(() => {
        if (orden) {
            setFormData({
                conservador_id: orden.conservador_id,
                tipo: orden.tipo,
                descripcion: orden.descripcion,
                fecha_solicitud: new Date(orden.fecha_solicitud),
                fecha_servicio: orden.fecha_servicio ? new Date(orden.fecha_servicio) : null,
                estado: orden.estado,
                costo: orden.costo?.toString() || '',
            })
        } else {
            setFormData({
                conservador_id: '',
                tipo: 'preventivo',
                descripcion: '',
                fecha_solicitud: new Date(),
                fecha_servicio: null,
                estado: 'pendiente',
                costo: '',
            })
        }
    }, [orden])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({
            ...formData,
            costo: formData.costo ? Number(formData.costo) : 0,
        })
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    {orden ? 'Editar Orden de Mantenimiento' : 'Nueva Orden de Mantenimiento'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Conservador</InputLabel>
                                <Select
                                    required
                                    value={formData.conservador_id}
                                    label="Conservador"
                                    onChange={(e) =>
                                        setFormData({ ...formData, conservador_id: e.target.value })
                                    }
                                >
                                    {conservadores.map((conservador) => (
                                        <MenuItem key={conservador.id} value={conservador.id}>
                                            {`${conservador.numero_serie} - ${conservador.cliente?.nombre || 'Sin cliente'}`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Tipo</InputLabel>
                                <Select
                                    value={formData.tipo}
                                    label="Tipo"
                                    onChange={(e) =>
                                        setFormData({ ...formData, tipo: e.target.value as 'preventivo' | 'correctivo' })
                                    }
                                >
                                    <MenuItem value="preventivo">Preventivo</MenuItem>
                                    <MenuItem value="correctivo">Correctivo</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    value={formData.estado}
                                    label="Estado"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            estado: e.target.value as 'pendiente' | 'en_proceso' | 'completado',
                                        })
                                    }
                                >
                                    <MenuItem value="pendiente">Pendiente</MenuItem>
                                    <MenuItem value="en_proceso">En Proceso</MenuItem>
                                    <MenuItem value="completado">Completado</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DatePicker
                                label="Fecha de Solicitud"
                                value={formData.fecha_solicitud}
                                onChange={(newValue) =>
                                    setFormData({ ...formData, fecha_solicitud: newValue || new Date() })
                                }
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DatePicker
                                label="Fecha de Servicio"
                                value={formData.fecha_servicio}
                                onChange={(newValue) =>
                                    setFormData({ ...formData, fecha_servicio: newValue })
                                }
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Descripción"
                                value={formData.descripcion}
                                onChange={(e) =>
                                    setFormData({ ...formData, descripcion: e.target.value })
                                }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Costo"
                                type="number"
                                value={formData.costo}
                                onChange={(e) => setFormData({ ...formData, costo: e.target.value })}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button type="submit" variant="contained">
                        Guardar
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}