import { Drawer, List, ListItemButton, Tooltip, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CategoryIcon from '@mui/icons-material/Category';

const miniDrawerWidth = 56;

const menuItems = [
  { icon: <DashboardIcon />, label: 'General', path: '/dashboard' },
  { icon: <ListAltIcon />, label: 'Transacciones', path: '/transactions' },
  { icon: <CategoryIcon />, label: 'Categorías', path: '/categories' },
];

export default function MiniRail({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      PaperProps={{
        sx: {
          width: miniDrawerWidth,
          bgcolor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider',
          pt: 0,
          alignItems: 'center',
          zIndex: (theme) => theme.zIndex.appBar - 1,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <List>
          {menuItems.map((item) => (
            <Tooltip title={item.label} placement="right" key={item.label}>
              <ListItemButton
                sx={{ justifyContent: 'center', minHeight: 48, width: '100%' }}
                onClick={() => onNavigate(item.path)}
              >
                {item.icon}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}