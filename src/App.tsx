import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LoginForm } from './components/auth/LoginForm'
import { Layout } from './components/layout/Layout'
import { ConservadoresList } from './components/conservadores/ConservadoresList'
import { CircularProgress, Box } from '@mui/material'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        )
    }

    if (!user) {
        return <Navigate to="/login" />
    }

    return <>{children}</>
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Dashboard />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="mantenimiento" element={<OrdenesMantenimientoList />} />
                        <Route path="conservadores" element={<ConservadoresList />} />
                        <Route path="mapa" element={<ConservadoresMap />} />
                        <Route path="clientes" element={<ClientesList />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App