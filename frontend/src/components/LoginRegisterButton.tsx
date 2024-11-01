import React from 'react';
import { Button, Box, Typography, SxProps  } from '@mui/material';

interface LoginRegisterButtonProps {
    title: string;
    onClick: () => void;
    sx?: SxProps;
    variant?: 'contained' | 'outlined';
}
const LoginRegisterButton: React.FC<LoginRegisterButtonProps> = ({ title, onClick,sx, variant = 'contained' }) => {
    return (
        <Button
            // variant="contained"
            variant={variant}
            fullWidth
            sx={{
                boxShadow: 5,
                textAlign: 'center',
                padding: '8px 12px',
                // height: {xs: '40px', md:'50px'},
                // width: {xs: '350px', md:'400px'},
                color: variant ==='contained' ? 'white' : '#0d598f',
                marginTop:'1%',
                marginBottom:'1%',
                borderColor: variant ==='contained' ? 'white' : '#0d598f',
                backgroundColor: variant === 'contained' ? '#9bcce5' : 'transparent',
                ...sx,
                '&:hover': {
                    backgroundColor: variant === 'contained' ? '#1f4152' : '#9bcce5', // Zmiana koloru po najechaniu
                },
            }}
            onClick={onClick}
        >
            <Box>
                <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' ,md: '1rem'} }}>
                    {title}
                </Typography>
            </Box>
        </Button>
    );
};

export default LoginRegisterButton;