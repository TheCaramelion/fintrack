import AppLayout from "../components/AppLayout";
import useAuthRedirect from "../hooks/useAuthRedirect";

export default function Profile() {
    useAuthRedirect();

    return (
        <>
            <AppLayout>
                
            </AppLayout>
        </>
    )
}