import AppLayout from "../components/AppLayout";
import CategoryForm from "../components/CategoryForm";
import CategoryList from "../components/CategoryList";
import useAuthRedirect from "../hooks/useAuthRedirect";

export default function Category() {
    useAuthRedirect();

    return (
        <>
            <AppLayout>
                <CategoryForm/>
                <CategoryList/>
            </AppLayout>
        </>
    )
}