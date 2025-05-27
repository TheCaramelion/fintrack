import { Grid } from "@mui/material";
import AppLayout from "../components/AppLayout";
import CategoryForm from "../components/CategoryForm";
import CategoryList from "../components/CategoryList";
import useAuthRedirect from "../hooks/useAuthRedirect";
import StyledPaper from "../styledComponents/StyledPaper";

export default function Category() {
    useAuthRedirect();

    return (
    <AppLayout>
        <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
                <StyledPaper elevation={3}>
                    <CategoryForm/>
                </StyledPaper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <StyledPaper elevation={3}>
                    <CategoryList/>
                </StyledPaper>
            </Grid>
        </Grid>
    </AppLayout>
    )
}