import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material'

interface ConfirmDialogProps {
    open: boolean
    title: string
    content: string
    onConfirm: () => void
    onClose: () => void
}

export const ConfirmDialog = ({
                                  open,
                                  title,
                                  content,
                                  onConfirm,
                                  onClose,
                              }: ConfirmDialogProps) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={onConfirm} color="error" autoFocus>
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    )
}