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
import QrCodeIcon from '@mui/icons-material/QrCode'
import AddIcon from '@mui/icons-material/Add'
import { conservadoresService } from '../../services/supabase/conservadoresService'
import { clientesService } from '../../services/supabase/clientesService'
import { ConservadorDialog } from './ConservadorDialog'
import { QRDialog } from './QRDialog'
import { ConfirmDialog } from '../common/ConfirmDialog'
import type { Conservador, Cliente } from '../../types'

export const ConservadoresList = () => {
    const [conservadores, setConservadores] = useState<Conservador[]>([])
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [loading, setLoading] = useState(true)
    const [openDialog, setOpenDialog] = useState(false)
    const [openQRDialog, setOpenQRDialog] = useState(false)
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
    const [selectedConservador, setSelectedConservador] = useState<Conservador | null>(null)

    const loadData = async () => {
        try {
            const [conservadoresData, clientesData] = await Promise.all([
                conservadoresService.getConservadores(),
                clientesService.getClientes(),
            ])
            setConservadores(conservadoresData)
            setClientes(clientesData)
        } catch (error) {
            console.error('Error al cargar datos:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleEdit = (conservador: Conservador) => {
        setSelectedConservador(conservador)
        setOpenDialog(true)
    }

    const handleDelete = (conservador: Conservador) => {
        setSelectedConservador(conservador)
        setOpenConfirmDialog(true)
    }

    const handleShowQR = (conservador: Conservador) => {
        setSelectedConservador(conservador)
        setOpenQRDialog(true)
    }

    const handleSave = async (conservador: Conservador) => {
        try {
            if (selectedConservador) {
                await conservadoresService.updateConservador(selectedConservador.id, conservador)
            } else {
                await conservadoresService.createConservador(conservador)
            }
            await loadData()
            setOpenDialog(false)
        } catch (error) {
            console.error('Error al guardar conservador:', error)
        }
    }

    const handleConfirmDelete = async () => {
        if (selectedConservador) {
            try {
                await conservadoresService.deleteConservador(selectedConservador.id)
                await loadData()
                setOpenConfirmDialog(false)
            } catch (error) {
                console.error('Error al eliminar conservador:', error)
            }
        }
    }

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'activo':
                return 'success'
            case 'mantenimiento':
                return 'warning'
            case 'inactivo':
                return 'error'
            default:
                return 'default'
        }
    }

    if (loading) return <div>Cargando...</div>

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Conservadores</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setSelectedConservador(null)
                        setOpenDialog(true)
                    }}
                >
                    Nuevo Conservador
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Número de Serie</TableCell>
                            <TableCell>Capacidad</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Modelo</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {conservadores.map((conservador) => (
                            <TableRow key={conservador.id}>
                                <TableCell>{conservador.numero_serie}</TableCell>
                                <TableCell>{conservador.capacidad}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={conservador.estado}
                                        color={getEstadoColor(conservador.estado)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{conservador.cliente?.nombre || 'Sin asignar'}</TableCell>
                                <TableCell>{conservador.modelo}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(conservador)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleShowQR(conservador)}>
                                        <QrCodeIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(conservador)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <ConservadorDialog
                open={openDialog}
                conservador={selectedConservador}
                clientes={clientes}
                onClose={() => setOpenDialog(false)}
                onSave={handleSave}
            />

            <QRDialog
                open={openQRDialog}
                conservador={selectedConservador}
                onClose={() => setOpenQRDialog(false)}
            />

            <ConfirmDialog
                open={openConfirmDialog}
                title="Eliminar Conservador"
                content="¿Estás seguro de que deseas eliminar este conservador?"
                onConfirm={handleConfirmDelete}
                onClose={() => setOpenConfirmDialog(false)}
            />
        </Box>
    )
}