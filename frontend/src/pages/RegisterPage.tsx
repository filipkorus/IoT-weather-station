// login page only for users of sensors and hardware not for potential custoomers of skiing resort
import { Box, Container, CssBaseline, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import LoginRegisterButton from "@/components/LoginRegisterButton.tsx";
import { useNavigate } from "react-router-dom";
import useRegister from "@/hooks/auth/useRegister";
import { removeAccessTokenIfObsolete } from "@/utils/removeAccessTokenIfObsolete";

const RegisterPage: React.FC = () => {
    const { register, isRegistering } = useRegister();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = () => register({ username: name, password });
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/account");
        }
    }, [navigate]);

    const goToMainPageAction = () => {
        removeAccessTokenIfObsolete();
        navigate("/");
    };

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
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault(); // Optional: Prevent unintended form submission if needed
                                            handleRegister();
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
                                            handleRegister();
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="flex" sx={{ justifyContent: "center" }}>
                            <LoginRegisterButton
                                title="Zarejestruj się"
                                onClick={handleRegister}
                                sx={{ height: { xs: "40px", md: "50px" } }}
                                disabled={isRegistering}
                            ></LoginRegisterButton>

                            <LoginRegisterButton
                                title="Masz już konto? Zaloguj się"
                                onClick={() => navigate("/login")}
                                sx={{ height: { xs: "40px", md: "50px" } }}
                                variant="outlined"
                            ></LoginRegisterButton>

                            <LoginRegisterButton
                                title="Strona główna"
                                onClick={goToMainPageAction}
                                sx={{ height: { xs: "40px", md: "50px" } }}
                                variant="mainPage"
                            ></LoginRegisterButton>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default RegisterPage;
