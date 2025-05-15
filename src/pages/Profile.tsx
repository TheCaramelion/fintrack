import AppLayout from "../components/AppLayout";
import useAuthRedirect from "../hooks/useAuthRedirect";
import { Box } from '@mui/material';

export default function Profile() {
    useAuthRedirect();

    return (
        <>
            <AppLayout>
                <Box/>
            </AppLayout>
        </>
    )
}