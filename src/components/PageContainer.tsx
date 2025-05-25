import { Box } from '@mui/material';

const pageContainerStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
  py: 4,
  px: { xs: 1, sm: 3, md: 6 },
};

export default function PageContainer({ children }: { children: React.ReactNode }) {
  return <Box sx={pageContainerStyle}>{children}</Box>;
}