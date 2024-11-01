import React from 'react';
import {Box, Typography} from '@mui/material';
// import LoginRegisterButton from "@/components/LoginRegisterButton.tsx";
import {useNavigate} from "react-router-dom";

const EntryPage: React.FC = () => {
    // const navigate = useNavigate();
    return (
        <Box>

            <Box
                sx={{
                    backgroundColor: '#1f4152',
                    padding: '16px',
                    textAlign: 'center',
                    marginBottom: '16px',
                    borderRadius: '8px'
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        color: 'white',
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                    }}
                >
                    ❄️Witamy na Narciarskiej Stacji Pomiarowo Pogodowej!❄️
                </Typography>
            </Box>
        </Box>
    );
    //     <div>
    //         <Typography variant="h2">Witamy na narciarskiej stacji pogodowej!</Typography>
    //         <Typography>jesteś ciekawy warunków na swoim ulubionym stoku? wybierz stację z listy aby je poznać</Typography>
    //         <Typography>jesteś włascicielem stacji? kliknij tu aby zarejestrować się lub zalogować i parować stacje  </Typography>
    //     </div>
    // );
};

export default EntryPage;