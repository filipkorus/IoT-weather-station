import * as React from "react";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Box, Typography } from "@mui/material";
import { ListItemButton } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { DisplayStation } from "@/hooks/usePublicStations";

// Dodanie typu dla propów
interface StationListProps {
    headerText?: string; // Opcjonalny tekst nagłówka
    stations: DisplayStation;
}

const StationList: React.FC<StationListProps> = ({ headerText, stations }) => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                width: "97%",
                maxWidth: { xs: "91%", lg: "100%" },
                bgcolor: "background.paper",
                borderRadius: "8px",
                padding: "1%",
                overflowY: "auto",
                maxHeight: { lg: "70vh", xs: "80vh" },
                "&::-webkit-scrollbar": {
                    width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                    backgroundColor: "#6e7e86",
                    borderRadius: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#1f4152",
                    borderRadius: "8px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#ffffff",
                },
            }}
        >
            {/* Dynamiczny nagłówek */}
            <Typography variant="h6" sx={{ mb: 2 }}>
                {headerText ||
                    "Jesteś ciekaw warunków na swoim ulubionym stoku? Wybierz stację z listy, aby je poznać:"}
            </Typography>

            <List>
                {stations?.length ? (
                    stations.map((station, index) => (
                        <ListItemButton
                            key={index}
                            onClick={() => navigate(`/slopedata/${station.id}`)}
                            sx={{
                                mb: 2,
                                "&:hover": {
                                    backgroundColor: "#d8eaf6",
                                },
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: "#1f4152" }}>{station.icon}</Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={station.name} />
                        </ListItemButton>
                    ))
                ) : (
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Brak stacji
                    </Typography>
                )}
            </List>
        </Box>
    );
};

export default StationList;
