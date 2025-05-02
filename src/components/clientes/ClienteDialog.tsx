import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
} from '@mui/material'
import { useEffect, useState } from 'react'
import type { Cliente } from '../../types'

interface ClienteDialogProps {
    open: boolean
    cliente: Cliente | null
    onClose: () => void
    onSave: (cliente: Omit<Cliente, 'id'>) => void
}

export const ClienteDialog = ({ open, cliente, onClose, onSave }: ClienteDialogProps) => {
    const [formData, setFormData] = useState({
        nombre: '',
        rfc: '',
        direccion: '',
        telefono: '',
        email: '',
    })

    useEffect(() => {
        if (cliente) {
            setFormData({
                nombre: cliente.nombre,
                rfc: cliente.rfc || '',
                direccion: cliente.direccion,
                telefono: cliente.telefono || '',
                email: cliente.email || '',
            })
        } else {
            setFormData({
                nombre: '',
                rfc: '',
                direccion: '',
                telefono: '',
                email: '',
            })
        }
    }, [cliente])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    {cliente ? 'Editar Cliente' : 'Nuevo Cliente'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Nombre"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="RFC"
                                value={formData.rfc}
                                onChange={(e) => setFormData({ ...formData, rfc: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Dirección"
                                value={formData.direccion}
                                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Teléfono"
                                value={formData.telefono}
                                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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