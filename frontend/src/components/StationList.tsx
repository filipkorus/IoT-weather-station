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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { DisplayStation } from "@/hooks/usePublicStations";

interface StationListProps {
    headerText?: string; // Opcjonalny tekst nagłówka
    stations: DisplayStation;
}

const StationList: React.FC<StationListProps> = ({ headerText, stations }) => {
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = React.useState(false);
    const [stationToDelete, setStationToDelete] = React.useState<string | null>(null);

    const handleEdit = (stationId: string) => {
        console.log("Edytuj stację:", stationId);
    };

    const handleOpenDialog = (stationId: string) => {
        setStationToDelete(stationId);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setStationToDelete(null);
    };

    const handleDeleteStation = () => {
        console.log("Stacja usunięta:", stationToDelete);
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

            {/* Dialog potwierdzający usunięcie */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{
                    "& .MuiDialog-paper": {
                        borderRadius: "16px",
                        padding: "16px",
                    },
                }}
            >
                <DialogTitle
                    id="alert-dialog-title"
                    sx={{
                        padding: "16px 24px",
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                    }}
                >
                    Potwierdź usunięcie
                </DialogTitle>
                <DialogContent sx={{ padding: "16px 24px" }}>
                    <Typography variant="body1">
                        Czy na pewno chcesz trwale usunąć tę stację?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ padding: "8px 24px" }}>
                    <Button onClick={handleCloseDialog} color="primary">
                        Anuluj
                    </Button>
                    <Button
                        onClick={handleDeleteStation}
                        color="error"
                        variant="contained"
                        autoFocus
                    >
                        Usuń
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StationList;
