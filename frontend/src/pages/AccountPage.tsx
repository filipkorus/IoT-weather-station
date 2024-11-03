import React from "react";
import { Box, Typography } from "@mui/material";
import PairAStation from "@/components/PairAStation"; // Upewnij się, że ścieżka do komponentu jest poprawna

const AccountPage: React.FC = () => {
    return (
        <Box
            sx={{
                display: "flex", // Ustawienie w poziomie
                flexDirection: "row", // Ustawienie kierunku na poziomy
                justifyContent: "space-between", // Rozdzielenie kontenerów
                padding: "2%",
                backgroundColor: "#f0f4f7",
                minHeight: "90vh",
                borderRadius: "8px",
            }}
        >
            {/* Pierwszy kontener - powitanie i informacja */}
            <Box
                sx={{
                    width: "48%", // Ustal szerokość na 48%
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    padding: "16px",
                    boxShadow: 2,
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
                    width: "48%", // Ustal szerokość na 48%
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    padding: "16px",
                    boxShadow: 2,
                    display: "flex",
                    justifyContent: "center", // Wyśrodkowanie przycisku
                    alignItems: "center", // Wyśrodkowanie w pionie
                }}
            >
                <PairAStation /> {/* Wstawienie komponentu PairAStation */}
            </Box>
        </Box>
    );
};

export default AccountPage;
