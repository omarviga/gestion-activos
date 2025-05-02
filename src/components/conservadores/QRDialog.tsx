import { Dialog, DialogTitle, DialogContent, Box } from '@mui/material'
import QRCode from 'qrcode.react'
import type { Conservador } from '../../types'

interface QRDialogProps {
    open: boolean
    conservador: Conservador | null
    onClose: () => void
}

export const QRDialog = ({ open, conservador, onClose }: QRDialogProps) => {
    if (!conservador) return null

    const qrData = JSON.stringify({
        id: conservador.id,
        numero_serie: conservador.numero_serie,
        capacidad: conservador.capacidad,
        modelo: conservador.modelo,
    })

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Código QR - {conservador.numero_serie}</DialogTitle>
            <DialogContent>
                <Box display="flex" justifyContent="center" p={2}>
                    <QRCode value={qrData} size={256} level="H" />
                </Box>
            </DialogContent>
        </Dialog>
    )
}