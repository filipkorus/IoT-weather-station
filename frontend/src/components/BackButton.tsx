import React from 'react';
import { Button, Box, Typography } from '@mui/material';

interface BackButtonProps {
    title: string;
    onClick: () => void;
}
const BackButton: React.FC<BackButtonProps> = ({ title, onClick }) => {
    return (
        <Button
            variant="outlined"
            fullWidth
            sx={{
                boxShadow: 5,
                textAlign: 'center',
                padding: '8px 12px',
                height: {xs: '40px', md:'50px'},
                width: {xs: '80px', md:'150px'},
                color: '#1f4152',
                borderColor: '#1f4152'
            }}
            onClick={onClick}
        >
            <Box>
                <Typography variant="body2" sx={{color:'#1f4152', fontSize: { xs: '0.5rem', sm: '1rem' ,md: '1rem'} }}>
                    {title}
                </Typography>
            </Box>
        </Button>
    );
};

export default BackButton;