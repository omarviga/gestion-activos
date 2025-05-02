import { useState, useCallback, useEffect } from 'react'
import {
    GoogleMap,
    useLoadScript,
    MarkerF,
    InfoWindowF,
} from '@react-google-maps/api'
import {
    Box,
    Paper,
    Typography,
    CircularProgress,
    Chip,
} from '@mui/material'
import type { Conservador } from '../../types'
import { conservadoresService } from '../../services/supabase/conservadoresService'

const mapContainerStyle = {
    width: '100%',
    height: '70vh',
}

const center = {
    lat: 20.5881, // Coordenadas aproximadas de México
    lng: -100.3889,
}

const options = {
    disableDefaultUI: false,
    zoomControl: true,
}

export const ConservadoresMap = () => {
    const [conservadores, setConservadores] = useState<Conservador[]>([])
    const [selectedConservador, setSelectedConservador] = useState<Conservador | null>(null)
    const [loading, setLoading] = useState(true)

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    })

    const loadConservadores = async () => {
        try {
            const data = await conservadoresService.getConservadores()
            setConservadores(data.filter(c => c.ubicacion_lat && c.ubicacion_lng))
        } catch (error) {
            console.error('Error al cargar conservadores:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadConservadores()
    }, [])

    const onMapClick = useCallback(() => {
        setSelectedConservador(null)
    }, [])

    const getMarkerIcon = (estado: string) => {
        const colors = {
            activo: '#4caf50',
            mantenimiento: '#ff9800',
            inactivo: '#f44336',
        }
        return {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: colors[estado as keyof typeof colors] || '#757575',
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: '#ffffff',
            scale: 10,
        }
    }

    if (loadError) return <div>Error al cargar el mapa</div>
    if (!isLoaded) return <CircularProgress />

    return (
        <Box sx={{ height: '100%' }}>
            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Mapa de Conservadores
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip label="Activo" color="success" size="small" />
                    <Chip label="Mantenimiento" color="warning" size="small" />
                    <Chip label="Inactivo" color="error" size="small" />
                </Box>
            </Paper>

            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={6}
                center={center}
                options={options}
                onClick={onMapClick}
            >
                {conservadores.map((conservador) => (
                    <MarkerF
                        key={conservador.id}
                        position={{
                            lat: Number(conservador.ubicacion_lat),
                            lng: Number(conservador.ubicacion_lng),
                        }}
                        onClick={() => setSelectedConservador(conservador)}
                        icon={getMarkerIcon(conservador.estado)}
                    />
                ))}

                {selectedConservador && (
                    <InfoWindowF
                        position={{
                            lat: Number(selectedConservador.ubicacion_lat),
                            lng: Number(selectedConservador.ubicacion_lng),
                        }}
                        onCloseClick={() => setSelectedConservador(null)}
                    >
                        <Box sx={{ p: 1 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                {selectedConservador.numero_serie}
                            </Typography>
                            <Typography variant="body2">
                                Cliente: {selectedConservador.cliente?.nombre || 'Sin asignar'}
                            </Typography>
                            <Typography variant="body2">
                                Capacidad: {selectedConservador.capacidad}
                            </Typography>
                            <Typography variant="body2">
                                Estado: {selectedConservador.estado}
                            </Typography>
                        </Box>
                    </InfoWindowF>
                )}
            </GoogleMap>
        </Box>
    )
}