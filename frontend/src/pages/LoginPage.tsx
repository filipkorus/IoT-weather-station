// login page only for users of sensors and hardware not for potential custoomers of skiing resort
import { Container, CssBaseline, Box, Typography, TextField, Grid } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginRegisterButton from "@/components/LoginRegisterButton.tsx";
import useLogin from "@/hooks/auth/useLogin";
const LoginPage: React.FC = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const { isLoggingIn, login } = useLogin();
    const handleLogin = () => {
        login({ username: name, password });
    };

    // const handleLogin = () => {};
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
                        src="icon.png" // Ścieżka do obrazka w folderze public
                        sx={{
                            width: "25%",
                            height: "auto",
                            mb: 2, // Odstęp poniżej obrazka
                        }}
                    />
                    <Typography variant="h4">Logowanie</Typography>
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
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault(); // Optional: Prevent unintended form submission if needed
                                            handleLogin();
                                        }
                                    }}
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
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault(); // Optional: Prevent unintended form submission if needed
                                            handleLogin();
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container justifyContent="flex" sx={{ justifyContent: "center" }}>
                            <LoginRegisterButton
                                title="Zaloguj się"
                                onClick={handleLogin}
                                disabled={isLoggingIn}
                                sx={{ height: { xs: "40px", md: "50px" } }}
                            ></LoginRegisterButton>

                            <LoginRegisterButton
                                title="Nie masz jeszcze konta? Zarejestruj się"
                                onClick={() => navigate("/register")}
                                sx={{ height: { xs: "40px", md: "50px" } }}
                                variant="outlined"
                            ></LoginRegisterButton>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default LoginPage;
