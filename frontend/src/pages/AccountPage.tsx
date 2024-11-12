import React from "react";
import { Box, Typography, Button } from "@mui/material";
import PairAStation from "@/components/PairAStation"; // Upewnij się, że ścieżka do komponentu jest poprawna

const AccountPage: React.FC = () => {
    const handleLogout = () => {
        // Funkcja do obsługi wylogowywania
        console.log("Wylogowano użytkownika");
    };

    return (
        <Box
            sx={{
                display: "flex", // Ustawienie w poziomie
                flexDirection: { xs: "column", sm: "row" }, // Zmieniamy kierunek w zależności od rozmiaru ekranu
                justifyContent: "space-between", // Rozdzielenie kontenerów
                padding: "2%",
                backgroundColor: "#9bcce5",
                minHeight: "90vh",
                borderRadius: "8px",
                gap: { lg: "1%", xl:"1%" }, // Przerwa między kontenerami w pionie na dużych ekranach
            }}
        >
            {/* Pierwszy kontener - powitanie i informacja */}
            <Box
                sx={{
                    width: { xs: "90%", sm: "48%" }, // Szerokość 100% na telefonach, 48% na większych ekranach
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    padding: "16px",
                    boxShadow: 2,
                    marginBottom: { xs: "16px", sm: "0" }, // Dodanie marginesu na telefonach
                }}
            >
                <Typography variant="h4" sx={{ marginBottom: "16px" }}>
                    Witaj na swoim koncie
                </Typography>

                <Typography variant="body1" sx={{ marginBottom: "24px" }}>
                    Tutaj możesz zarządzać swoimi stacjami i parować nowe urządzenia.
                </Typography>
            </Box>

            {/* Drugi kontener - przycisk do sparowania nowej stacji */}
            <Box
                sx={{
                    width: { xs: "90%", sm: "48%" }, // Szerokość 100% na telefonach, 48% na większych ekranach
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    padding: "16px",
                    boxShadow: 2,
                    display: "flex",
                    justifyContent: "center", // Wyśrodkowanie przycisku
                    alignItems: "center", // Wyśrodkowanie w pionie
                    flexDirection: "column", // Ustawienie zawartości w kolumnie
                    gap: "16px", // Przerwa pomiędzy elementami
                }}
            >
                <PairAStation /> {/* Wstawienie komponentu PairAStation */}

                <Button
                    variant="outlined"
                    onClick={handleLogout}
                    sx={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        borderColor: "#0d598f",
                        "&:hover": {
                            backgroundColor: "#0d598f",
                            color: "#fff",
                        },
                    }}
                >
                    Wyloguj się
                </Button>
            </Box>
        </Box>
    );
};

export default AccountPage;
