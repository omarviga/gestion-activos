import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Typography,
    Box
} from '@mui/material';
import type { Conservador, Cliente } from '../../types';

interface ConservadorDialogProps {
    open: boolean;
    conservador: Conservador | null;
    clientes: Cliente[];
    onClose: () => void;
    onSave: (conservador: Omit<Conservador, 'id'>) => void;
}

const center = {
    lat: -33.45694,  // Coordenadas por defecto (ejemplo: Santiago de Chile)
    lng: -70.64827
};

export const ConservadorDialog = ({
                                      open,
                                      conservador,
                                      clientes,
                                      onClose,
                                      onSave,
                                  }: ConservadorDialogProps) => {
    const [formData, setFormData] = useState({
        numero_serie: '',
        capacidad: '',
        modelo: '',
        estado: 'activo',
        cliente_id: '',
        ubicacion_lat: '',
        ubicacion_lng: '',
    });

    useEffect(() => {
        if (conservador) {
            setFormData({
                numero_serie: conservador.numero_serie,
                capacidad: conservador.capacidad.toString(),
                modelo: conservador.modelo || '',
                estado: conservador.estado,
                cliente_id: conservador.cliente_id || '',
                ubicacion_lat: conservador.ubicacion_lat?.toString() || '',
                ubicacion_lng: conservador.ubicacion_lng?.toString() || '',
            });
        } else {
            setFormData({
                numero_serie: '',
                capacidad: '',
                modelo: '',
                estado: 'activo',
                cliente_id: '',
                ubicacion_lat: '',
                ubicacion_lng: '',
            });
        }
    }, [conservador]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            capacidad: Number(formData.capacidad),
            ubicacion_lat: formData.ubicacion_lat ? Number(formData.ubicacion_lat) : null,
            ubicacion_lng: formData.ubicacion_lng ? Number(formData.ubicacion_lng) : null,
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    {conservador ? 'Editar Conservador' : 'Nuevo Conservador'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Número de Serie"
                                value={formData.numero_serie}
                                onChange={(e) => setFormData({ ...formData, numero_serie: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Capacidad"
                                type="number"
                                value={formData.capacidad}
                                onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Modelo"
                                value={formData.modelo}
                                onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    value={formData.estado}
                                    label="Estado"
                                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                >
                                    <MenuItem value="activo">Activo</MenuItem>
                                    <MenuItem value="mantenimiento">Mantenimiento</MenuItem>
                                    <MenuItem value="inactivo">Inactivo</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Cliente</InputLabel>
                                <Select
                                    value={formData.cliente_id}
                                    label="Cliente"
                                    onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                                >
                                    <MenuItem value="">Sin asignar</MenuItem>
                                    {clientes.map((cliente) => (
                                        <MenuItem key={cliente.id} value={cliente.id}>
                                            {cliente.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* Sección del LocationPicker */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Ubicación
                            </Typography>
                            <Box sx={{ height: '300px', width: '100%', mb: 2 }}>
                                <LocationPicker
                                    initialPosition={{
                                        lat: formData.ubicacion_lat ? Number(formData.ubicacion_lat) : center.lat,
                                        lng: formData.ubicacion_lng ? Number(formData.ubicacion_lng) : center.lng,
                                    }}
                                    onChange={(position) => {
                                        setFormData({
                                            ...formData,
                                            ubicacion_lat: position.lat.toString(),
                                            ubicacion_lng: position.lng.toString(),
                                        });
                                    }}
                                />
                            </Box>
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
    );
};