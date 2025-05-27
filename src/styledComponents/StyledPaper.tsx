import { styled, Paper } from '@mui/material';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    height: '100%',
    transition: 'box-shadow 0.3s',
    '&:hover': {
        boxShadow: theme.shadows[8],
    },
}))

export default StyledPaper;