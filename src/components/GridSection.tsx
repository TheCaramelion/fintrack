import { Grid, Paper } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

interface GridSectionProps {
    children: ReactNode;
    gridProps?: object;
    paperProps?: object;
}

const GridSection: FunctionComponent<GridSectionProps> = ({ children, gridProps, paperProps }) => (
    <Grid item xs={12} md={6} {...gridProps}>
        <Paper elevation={3} sx={{ p: 2, height: '100%' }} {...paperProps}>
            {children}
        </Paper>
    </Grid>
);

export default GridSection;