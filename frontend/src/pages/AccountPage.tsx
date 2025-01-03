import React from "react";
import { Box, Button } from "@mui/material";
import PairAStation from "@/components/PairAStation";
import Banner from "@/components/Banner.tsx";
import StationList from "@/components/StationList.tsx";
import useLogout from "@/hooks/auth/useLogout";
import usePrivateStations from "@/hooks/usePrivateStations";


//zmiana nazwy stacji i usuwanie stacji

const AccountPage: React.FC = () => {
    const { isLoggingOut, logout } = useLogout();
    const stations = usePrivateStations();

    const handleLogout = () => {
        logout();
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row", md: "column", lg: "row" },
                justifyContent: "space-between",
                padding: "2%",
                backgroundColor: "#9bcce5",
                minHeight: { lg: "90vh", xs: "95vh" }, // Minimalna wysokość całej sekcji
                borderRadius: "8px",
                gap: { lg: "1%", xl: "1%" },
            }}
        >
            {/* Pierwszy kontener z listą stacji */}
            <Box
                sx={{
                    width: { xs: "90%", sm: "48%", md: "95%" },
                    backgroundColor: "#fdfdfd",
                    borderRadius: "8px",
                    padding: "16px",
                    boxShadow: 2,
                    marginBottom: { xs: "16px", sm: "0" },
                }}
            >
                <Banner message="❄️Witaj na swoim koncie❄️" />
                <StationList headerText="Twoje stacje:" stations={stations} showActions={true} />
            </Box>

            <Box
                sx={{
                    width: { xs: "90%", sm: "48%", md: "95%" },
                    backgroundColor: "#fdfdfd",
                    borderRadius: "8px",
                    padding: "16px",
                    boxShadow: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                    minHeight: { lg: "85vh", xs: "50vh" },
                }}
            >
                <PairAStation />

                <Button
                    variant="outlined"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
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
