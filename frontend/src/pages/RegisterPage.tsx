// login page only for users of sensors and hardware not for potential custoomers of skiing resort
import { Box, Container, CssBaseline,Grid, TextField,Typography,} from "@mui/material";
import React, { useState } from "react";
import LoginRegisterButton from "@/components/LoginRegisterButton.tsx";
import {useNavigate} from "react-router-dom";

const RegisterPage: React.FC = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {};
    const navigate = useNavigate();
    return (
        <>
            <Container maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        mt: 20,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Box
                        component="img"
                        src="public/icon.png" // Ścieżka do obrazka w folderze public
                        sx={{
                            width: '25%', // Możesz ustawić na '100%' lub inną wartość
                            height: 'auto',
                            mb: 2, // Odstęp poniżej obrazka
                        }}
                    />

                    <Typography variant="h4">Rejestracja</Typography>
                    <Box sx={{ mt: 3 }} maxWidth="xs">
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="name"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Nazwa"
                                    autoFocus
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12} maxWidth="xs">
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Hasło"
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="flex" sx={{justifyContent: 'center'}}>
                        <LoginRegisterButton title="Zarejestruj się" onClick={(handleRegister)} sx={{height: {xs: '40px', md:'50px'}}} ></LoginRegisterButton>

                            <LoginRegisterButton title="Masz już konto? Zaloguj się" onClick={() => navigate('/login')}  sx={{ height: { xs: '40px', md: '50px' }}}  variant="outlined" ></LoginRegisterButton>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default RegisterPage;