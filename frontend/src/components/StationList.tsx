import * as React from "react";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Box, Typography } from "@mui/material";
import { ListItemButton } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import usePublicStations from "@/hooks/usePublicStations";
import { useSelector } from "react-redux";
import { getLiveData } from "@/store/slices/liveDataSlice";

export default function StationList() {
    const stations = usePublicStations();
    const navigate = useNavigate();
    const liveData = useSelector(getLiveData);

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
                    // Styl paska przewijania dla WebKit (Chrome, Safari)
                    width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                    // Styl ścieżki paska przewijania
                    backgroundColor: "#6e7e86",
                    borderRadius: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                    // Styl uchwytu paska przewijania
                    backgroundColor: "#1f4152",
                    borderRadius: "8px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                    // Styl po najechaniu kursorem
                    backgroundColor: "#ffffff",
                },
            }}
        >
            <Typography variant="h6" sx={{ mb: 2 }}>
                Jesteś ciekaw warunków na swoim ulubionym stoku? Wybierz stację z listy, aby je poznać:
            </Typography>
            <List>
                {stations.map((station, index) => (
                    <ListItemButton
                        key={index}
                        onClick={() => navigate(`/slopedata/${station.id}`)} //trzeba zrobic osobne przekierowania slopedata:id do kazdego stoku
                        sx={{
                            mb: 2,
                            "&:hover": {
                                backgroundColor: "#d8eaf6",
                                // padding:'1%'
                            },
                        }}
                    >
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: "#1f4152" }}>{station.icon}</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={station.name} />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );
}
