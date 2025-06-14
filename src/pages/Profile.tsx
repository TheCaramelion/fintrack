import AppLayout from "../components/AppLayout";
import useAuthRedirect from "../hooks/useAuthRedirect";
import { Box, Avatar, Typography, Paper, Divider, Button, Stack } from '@mui/material';
import { auth } from '../firebase';

export default function Profile() {
    useAuthRedirect();
    const user = auth.currentUser;

    const createdAt = user?.metadata?.creationTime
        ? new Date(user.metadata.creationTime).toLocaleDateString('es-ES')
        : "Desconocido";

    return (
        <AppLayout>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <Paper sx={{ p: 4, minWidth: 320, textAlign: 'center' }}>
                    <Avatar
                        src={user?.photoURL ?? undefined}
                        alt={user?.email ?? undefined}
                        sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                    />
                    <Typography variant="h6">{user?.displayName || "Sin nombre"}</Typography>
                    <Typography variant="body1" color="text.secondary">{user?.email}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Cuenta creada: {createdAt}
                    </Typography>
                    <Divider sx={{ my: 3 }} />
                    <Stack spacing={2}>
                        <Button variant="outlined" color="primary" fullWidth>
                            Cambiar contraseña
                        </Button>
                        <Button variant="outlined" color="primary" fullWidth>
                            Actualizar perfil
                        </Button>
                        <Button variant="contained" color="error" fullWidth onClick={() => auth.signOut()}>
                            Cerrar sesión
                        </Button>
                    </Stack>
                </Paper>
            </Box>
        </AppLayout>
    );
}