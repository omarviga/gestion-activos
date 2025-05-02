import { useState } from 'react'
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api'
import { CircularProgress } from '@mui/material'

interface LocationPickerProps {
    initialPosition: {
        lat: number
        lng: number
    }
    onChange: (position: { lat: number; lng: number }) => void
}

const mapContainerStyle = {
    width: '100%',
    height: '100%',
}

const options = {
    disableDefaultUI: false,
    zoomControl: true,
}

export const LocationPicker = ({ initialPosition, onChange }: LocationPickerProps) => {
    const [position, setPosition] = useState(initialPosition)
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    })

    const handleClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const newPosition = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
            }
            setPosition(newPosition)
            onChange(newPosition)
        }
    }

    if (loadError) return <div>Error al cargar el mapa</div>
    if (!isLoaded) return <CircularProgress />

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={13}
            center={position}
            options={options}
            onClick={handleClick}
        >
            <MarkerF position={position} draggable={true} onDragEnd={(e) => {
                if (e.latLng) {
                    const newPosition = {
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng(),
                    }
                    setPosition(newPosition)
                    onChange(newPosition)
                }
            }} />
        </GoogleMap>
    )
}