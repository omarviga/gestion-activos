import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Button,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import PeopleIcon from '@mui/icons-material/People'
import BarChartIcon from '@mui/icons-material/BarChart'
import BuildIcon from '@mui/icons-material/Build'
import MapIcon from '@mui/icons-material/Map' // Importa el icono de mapa
import { useAuth } from '../../context/AuthContext'

const drawerWidth = 240

export const Layout = () => {
    const [mobileOpen, setMobileOpen] = useState(false)
    const { signOut, user } = useAuth()
    const navigate = useNavigate()

    const menuItems = [
        { text: 'Conservadores', icon: <AcUnitIcon />, path: '/conservadores' },
        { text: 'Clientes', icon: <PeopleIcon />, path: '/clientes' },
        { text: 'Mantenimiento', icon: <BuildIcon />, path: '/mantenimiento' },
        { text: 'Dashboard', icon: <BarChartIcon />, path: '/dashboard' },
        { text: 'Mapa', icon: <MapIcon />, path: '/mapa' }, // Nuevo ítem añadido
    ]

    const drawer = (
        <div>
            <Toolbar />
            <List>
                {menuItems.map((item) => (
                    <ListItem
                        button
                        key={item.text}
                        onClick={() => navigate(item.path)}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </div>
    )

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Hielo Polar del Centro
                    </Typography>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                        {user?.email}
                    </Typography>
                    <Button color="inherit" onClick={() => signOut()}>
                        Cerrar Sesión
                    </Button>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    marginTop: '64px',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    )
}