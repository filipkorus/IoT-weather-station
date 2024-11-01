import React from 'react';
import {Box, Typography} from '@mui/material';
import LoginRegisterButton from "@/components/LoginRegisterButton.tsx";
import {useNavigate} from "react-router-dom";

const EntryPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <Box>
            {/* Górny kontener z napisem "Witamy" */}
            <Box
                sx={{
                    backgroundColor: '#1f4152', // Kolor tła
                    padding: '16px', // Padding
                    textAlign: 'center', // Wyśrodkowanie tekstu
                    marginBottom: '16px', // Odstęp od dolnej części
                    borderRadius: '8px'
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        color: 'white',
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } // Dostosowanie rozmiaru czcionki
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