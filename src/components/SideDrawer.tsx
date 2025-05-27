import type { FunctionComponent } from 'react';
import { Drawer, Box, List, ListItem, IconButton, ListItemText, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { drawerHeaderStyle, drawerBoxStyle, drawerListItemStyle } from '../styles/drawerStyles';

interface SideDrawer {
    open: boolean;
    onClose: () => void;
    onNavigate: (path: string) => void;
}

const PersistentDrawer: FunctionComponent<SideDrawer> = ({ open, onClose, onNavigate }) => {
    return (
        <Drawer variant="temporary" anchor="left" open={open}>
            <Box sx={drawerHeaderStyle}>
                <Typography variant="h6">Fintrack</Typography>
            </Box>
            <Box sx={drawerBoxStyle} role="presentation">
                <List>
                    <ListItem component="button" sx={drawerListItemStyle} onClick={() => onNavigate('/dashboard')}>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                    <ListItem component="button" sx={drawerListItemStyle} onClick={() => onNavigate('/transactions')}>
                        <ListItemText primary="Transactions" />
                    </ListItem>
                    <ListItem component="button" sx={drawerListItemStyle} onClick={() => onNavigate('/categories')}>
                        <ListItemText primary="Categories" />
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