import { useEffect, useState } from 'react'
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Typography,
    Chip,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { mantenimientoService } from '../../services/supabase/mantenimientoService'
import { OrdenMantenimientoDialog } from './OrdenMantenimientoDialog'
import { ConfirmDialog } from '../common/ConfirmDialog'
import type { OrdenMantenimiento } from '../../types'

export const OrdenesMantenimientoList = () => {
    const [ordenes, setOrdenes] = useState<OrdenMantenimiento[]>([])
    const [loading, setLoading] = useState(true)
    const [openDialog, setOpenDialog] = useState(false)
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
    const [selectedOrden, setSelectedOrden] = useState<OrdenMantenimiento | null>(null)

    const loadOrdenes = async () => {
        try {
            const data = await mantenimientoService.getOrdenes()
            setOrdenes(data)
        } catch (error) {
            console.error('Error al cargar órdenes:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadOrdenes()
    }, [])

    const handleEdit = (orden: OrdenMantenimiento) => {
        setSelectedOrden(orden)
        setOpenDialog(true)
    }

    const handleDelete = (orden: OrdenMantenimiento) => {
        setSelectedOrden(orden)
        setOpenConfirmDialog(true)
    }

    const handleSave = async (orden: OrdenMantenimiento) => {
        try {
            if (selectedOrden) {
                await mantenimientoService.updateOrden(selectedOrden.id, orden)
            } else {
                await mantenimientoService.createOrden(orden)
            }
            await loadOrdenes()
            setOpenDialog(false)
        } catch (error) {
            console.error('Error al guardar orden:', error)
        }
    }

    const handleConfirmDelete = async () => {
        if (selectedOrden) {
            try {
                await mantenimientoService.deleteOrden(selectedOrden.id)
                await loadOrdenes()
                setOpenConfirmDialog(false)
            } catch (error) {
                console.error('Error al eliminar orden:', error)
            }
        }
    }

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'pendiente':
                return 'warning'
            case 'en_proceso':
                return 'info'
            case 'completado':
                return 'success'
            default:
                return 'default'
        }
    }

    if (loading) return <div>Cargando...</div>

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Órdenes de Mantenimiento</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setSelectedOrden(null)
                        setOpenDialog(true)
                    }}
                >
                    Nueva Orden
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Fecha Solicitud</TableCell>
                            <TableCell>Conservador</TableCell>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Fecha Servicio</TableCell>
                            <TableCell>Costo</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ordenes.map((orden) => (
                            <TableRow key={orden.id}>
                                <TableCell>
                                    {format(new Date(orden.fecha_solicitud), 'dd/MM/yyyy', { locale: es })}
                                </TableCell>
                                <TableCell>
                                    {orden.conservador.numero_serie}
                                    <Typography variant="caption" display="block" color="textSecondary">
                                        {orden.conservador.modelo}
                                    </Typography>
                                </TableCell>
                                <TableCell>{orden.conservador.cliente.nombre}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={orden.tipo}
                                        color={orden.tipo === 'preventivo' ? 'primary' : 'secondary'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={orden.estado}
                                        color={getEstadoColor(orden.estado)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {orden.fecha_servicio
                                        ? format(new Date(orden.fecha_servicio), 'dd/MM/yyyy', { locale: es })
                                        : 'Sin programar'}
                                </TableCell>
                                <TableCell>${orden.costo?.toFixed(2) || '0.00'}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(orden)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(orden)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <OrdenMantenimientoDialog
                open={openDialog}
                orden={selectedOrden}
                onClose={() => setOpenDialog(false)}
                onSave={handleSave}
            />

            <ConfirmDialog
                open={openConfirmDialog}
                title="Eliminar Orden"
                content="¿Estás seguro de que deseas eliminar esta orden de mantenimiento?"
                onConfirm={handleConfirmDelete}
                onClose={() => setOpenConfirmDialog(false)}
            />
        </Box>
    )
}