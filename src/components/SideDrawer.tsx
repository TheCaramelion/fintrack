import { FunctionComponent } from 'react';
import { Drawer, Box, List, ListItem, IconButton, ListItemText, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface SideDrawer {
    open: boolean;
    onClose: () => void;
    onNavigate: (path: string) => void;
}

const PersistentDrawer: FunctionComponent<SideDrawer> = ({ open, onClose, onNavigate }) => {
    return (
    <Drawer variant="persistent" anchor="left" open={open}>
        <Box
            sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                padding: '16px',
                textAlign: 'center',
            }}>
            <Typography variant="h6">Fintrack</Typography>
        </Box>
        <Box sx={{ width: 250 }} role="presentation">
        <List>
        <ListItem button onClick={() => onNavigate('/dashboard')}>
            <ListItemText>Dashboard</ListItemText>
        </ListItem>
        <ListItem button onClick={() => onNavigate('/transactions')}>
            <ListItemText>Transactions</ListItemText>
        </ListItem>
        <ListItem button onClick={() => onNavigate('/categories')}>
            <ListItemText>Categories</ListItemText>
        </ListItem>
        <ListItem>
            <IconButton edge="start" color="inherit" onClick={onClose}>
            <ArrowBackIcon />
            </IconButton>
        </ListItem>
        </List>
    </Box>
    </Drawer>
);
};

export default PersistentDrawer;