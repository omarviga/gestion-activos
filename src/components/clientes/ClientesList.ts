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
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { clientesService } from '../../services/supabase/clientesService'
import { ClienteDialog } from './ClienteDialog'
import { ConfirmDialog } from '../common/ConfirmDialog'
import type { Cliente } from '../../types'

export const ClientesList = () => {
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [loading, setLoading] = useState(true)
    const [openDialog, setOpenDialog] = useState(false)
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)

    const loadClientes = async () => {
        try {
            const data = await clientesService.getClientes()
            setClientes(data)
        } catch (error) {
            console.error('Error al cargar clientes:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadClientes()
    }, [])

    const handleEdit = (cliente: Cliente) => {
        setSelectedCliente(cliente)
        setOpenDialog(true)
    }

    const handleDelete = (cliente: Cliente) => {
        setSelectedCliente(cliente)
        setOpenConfirmDialog(true)
    }

    const handleSave = async (cliente: Cliente) => {
        try {
            if (selectedCliente) {
                await clientesService.updateCliente(selectedCliente.id, cliente)
            } else {
                await clientesService.createCliente(cliente)
            }
            await loadClientes()
            setOpenDialog(false)
        } catch (error) {
            console.error('Error al guardar cliente:', error)
        }
    }

    const handleConfirmDelete = async () => {
        if (selectedCliente) {
            try {
                await clientesService.deleteCliente(selectedCliente.id)
                await loadClientes()
                setOpenConfirmDialog(false)
            } catch (error) {
                console.error('Error al eliminar cliente:', error)
            }
        }
    }

    if (loading) return <div>Cargando...</div>

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
    <Typography variant="h5">Clientes</Typography>
        <Button
    variant="contained"
    startIcon={<AddIcon />}
    onClick={() => {
        setSelectedCliente(null)
        setOpenDialog(true)
    }}
>
    Nuevo Cliente
    </Button>
    </Box>

    <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Nombre</TableCell>
        <TableCell>RFC</TableCell>
        <TableCell>Teléfono</TableCell>
        <TableCell>Email</TableCell>
        <TableCell>Conservadores</TableCell>
        <TableCell>Acciones</TableCell>
        </TableRow>
        </TableHead>
        <TableBody>
        {clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                <TableCell>{cliente.nombre}</TableCell>
                <TableCell>{cliente.rfc}</TableCell>
                <TableCell>{cliente.telefono}</TableCell>
                <TableCell>{cliente.email}</TableCell>
                <TableCell>{cliente.conservadores?.length || 0}</TableCell>
                <TableCell>
                <IconButton onClick={() => handleEdit(cliente)}>
    <EditIcon />
    </IconButton>
    <IconButton onClick={() => handleDelete(cliente)}>
    <DeleteIcon />
    </IconButton>
    </TableCell>
    </TableRow>
))}
    </TableBody>
    </Table>
    </TableContainer>

    <ClienteDialog
    open={openDialog}
    cliente={selectedCliente}
    onClose={() => setOpenDialog(false)}
    onSave={handleSave}
    />

    <ConfirmDialog
    open={openConfirmDialog}
    title="Eliminar Cliente"
    content="¿Estás seguro de que deseas eliminar este cliente?"
    onConfirm={handleConfirmDelete}
    onClose={() => setOpenConfirmDialog(false)}
    />
    </Box>
)
}