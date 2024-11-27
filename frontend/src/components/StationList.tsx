import * as React from "react";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import {
    Box,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Button,
    TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PlaceIcon from "@mui/icons-material/Place"; // Ikonka lokalizacji
import { useNavigate } from "react-router-dom";
import { DisplayStation } from "@/hooks/usePublicStations";

interface StationListProps {
    headerText?: string; // Opcjonalny tekst nagłówka
    stations: DisplayStation;
    showActions?: boolean; // Czy pokazywać ikony akcji
}

const StationList: React.FC<StationListProps> = ({ headerText, stations, showActions = false }) => {
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = React.useState(false);
    const [stationToEdit, setStationToEdit] = React.useState<string | null>(null);
    const [coordinates, setCoordinates] = React.useState({ long: "", lat: "" });

    const handleEdit = (stationId: string) => {
        console.log("Edytuj stację:", stationId);
    };

    const handleOpenDialog = (stationId: string) => {
        setStationToEdit(stationId);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setStationToEdit(null);
        setCoordinates({ long: "", lat: "" });
    };

    const handleSaveCoordinates = () => {
        console.log(`Współrzędne dla stacji ${stationToEdit}:`, coordinates);
        handleCloseDialog(); // Zamknij popup
    };

    return (
        <Box
            sx={{
                width: "97%",
                maxWidth: { xs: "91%", lg: "100%" },
                backgroundColor: "background.paper",
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
            <Typography variant="h6" sx={{ mb: 2, padding: { xs: "3%" } }}>
                {headerText ||
                    "Jesteś ciekaw warunków na swoim ulubionym stoku? Wybierz stację z listy, aby je poznać:"}
            </Typography>

            <List>
                {stations?.length ? (
                    stations.map((station, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                mb: 2,
                                "&:hover": {
                                    backgroundColor: "#d8eaf6",
                                },
                                padding: "8px",
                                borderRadius: "8px",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexGrow: 1,
                                    cursor: "pointer",
                                }}
                                onClick={() => navigate(`/slopedata/${station.id}`)}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: "#1f4152" }}>{station.icon}</Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={station.name} />
                            </Box>

                            {/* Action icons */}
                            {showActions && (
                                <Box>
                                    <IconButton
                                        aria-label="Edit"
                                        onClick={() => handleEdit(station.id)}
                                        sx={{ marginRight: 1 }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton aria-label="Location" onClick={() => handleOpenDialog(station.id)}>
                                        <PlaceIcon />
                                    </IconButton>
                                </Box>
                            )}
                        </Box>
                    ))
                ) : (
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Brak stacji
                    </Typography>
                )}
            </List>

            {/* Dialog wprowadzania współrzędnych */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="location-dialog-title"
                sx={{
                    "& .MuiDialog-paper": {
                        borderRadius: "16px",
                        padding: "16px",
                    },
                }}
            >
                <DialogTitle
                    id="location-dialog-title"
                    sx={{
                        padding: "16px 24px",
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                    }}
                >
                    Wprowadź współrzędne
                </DialogTitle>
                <DialogContent
                    sx={{
                        padding: "16px 24px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                    }}
                >
                    <TextField
                        label="Długość geograficzna (Long)"
                        value={coordinates.long}
                        onChange={(e) => setCoordinates({ ...coordinates, long: e.target.value })}
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        label="Szerokość geograficzna (Lat)"
                        value={coordinates.lat}
                        onChange={(e) => setCoordinates({ ...coordinates, lat: e.target.value })}
                        fullWidth
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions sx={{ padding: "8px 24px" }}>
                    <Button onClick={handleCloseDialog} color="primary">
                        Anuluj
                    </Button>
                    <Button onClick={handleSaveCoordinates} color="success" variant="contained" autoFocus>
                        Zapisz
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StationList;
