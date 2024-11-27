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
import PlaceIcon from "@mui/icons-material/Place";
import { useNavigate } from "react-router-dom";
import { DisplayStation } from "@/hooks/usePublicStations";
import useUpdateGatewayInfo from "@/hooks/useUpdateGatewayInfo";
import { useSnackbar } from "@/hooks/useSnackbar";

interface StationListProps {
    headerText?: string;
    stations: DisplayStation;
    showActions?: boolean;
}

const StationList: React.FC<StationListProps> = ({ headerText, stations, showActions = false }) => {
    const navigate = useNavigate();
    const [openNameDialog, setOpenNameDialog] = React.useState(false);
    const [openLocationDialog, setOpenLocationDialog] = React.useState(false);
    const [stationToEdit, setStationToEdit] = React.useState<DisplayStation[number] | null>(null);
    const [coordinates, setCoordinates] = React.useState<{ long: number | null; lat: number | null }>({
        long: null,
        lat: null,
    });
    const [stationName, setStationName] = React.useState("");
    const showSnackbar = useSnackbar();

    // Funkcja otwierająca dialog dla edycji nazwy stacji
    const handleOpenNameDialog = (station: DisplayStation[number]) => {
        setStationToEdit(station);
        setStationName(station.name);
        setOpenNameDialog(true);
    };

    // Funkcja otwierająca dialog dla edycji lokalizacji
    const handleOpenLocationDialog = (station: DisplayStation[number]) => {
        setStationToEdit(station);
        setCoordinates({ long: station.coords?.longitude, lat: station.coords?.latitude });
        setOpenLocationDialog(true);
    };

    const handleCloseNameDialog = () => {
        setOpenNameDialog(false);
        setStationName("");
    };

    const handleCloseLocationDialog = React.useCallback(() => {
        setOpenLocationDialog(false);
        setCoordinates({ long: null, lat: null });
    }, []);

    const { updateGatewayInfo, isUpdatingGatewayInfo } = useUpdateGatewayInfo(
        stationToEdit?.id ?? "",
        handleCloseLocationDialog,
    );

    const handleSaveName = () => {
        if (stationToEdit) {
            console.log(`Zmieniono nazwę stacji ${stationToEdit.id} na: ${stationName}`);
        }
        handleCloseNameDialog();
    };

    const handleSaveLocation = () => {
        if (stationToEdit) {
            updateGatewayInfo({
                infoToUpdate: {
                    ...(coordinates.long && { longitude: coordinates.long }),
                    ...(coordinates.lat && { latitude: coordinates.lat }),
                },
            });
        } else {
            showSnackbar("Nie ma id bramy!", "error");
        }
        // handleCloseLocationDialog();
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

            {/* Dialog edycji nazwy stacji */}
            <Dialog
                open={openNameDialog}
                onClose={handleCloseNameDialog}
                aria-labelledby="edit-name-dialog-title"
                sx={{
                    "& .MuiDialog-paper": {
                        borderRadius: "16px",
                        padding: "16px",
                    },
                }}
            >
                <DialogTitle
                    id="edit-name-dialog-title"
                    sx={{
                        padding: "16px 24px",
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                    }}
                >
                    Edytuj nazwę stacji
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
                        label="Nazwa stacji"
                        value={stationName}
                        onChange={(e) => setStationName(e.target.value)}
                        fullWidth
                        variant="outlined"
                        disabled={isUpdatingGatewayInfo}
                    />
                </DialogContent>
                <DialogActions sx={{ padding: "8px 24px" }}>
                    <Button onClick={handleCloseNameDialog} color="primary">
                        Anuluj
                    </Button>
                    <Button onClick={handleSaveName} color="success" variant="contained" autoFocus>
                        Zapisz
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog edycji lokalizacji */}
            <Dialog
                open={openLocationDialog}
                onClose={handleCloseLocationDialog}
                aria-labelledby="edit-location-dialog-title"
                sx={{
                    "& .MuiDialog-paper": {
                        borderRadius: "16px",
                        padding: "16px",
                    },
                }}
            >
                <DialogTitle
                    id="edit-location-dialog-title"
                    sx={{
                        padding: "16px 24px",
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                    }}
                >
                    Edytuj lokalizację
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
                        type="number"
                        label="Długość geograficzna"
                        value={coordinates.long ?? ""}
                        onChange={(e) => {
                            setCoordinates({ ...coordinates, long: parseFloat(e.target.value) });
                        }}
                        fullWidth
                        variant="outlined"
                        disabled={isUpdatingGatewayInfo}
                    />
                </DialogContent>
                <DialogActions sx={{ padding: "8px 24px" }}>
                    <Button onClick={handleCloseNameDialog} color="primary">
                        Anuluj
                    </Button>
                    <Button onClick={handleSaveName} color="success" variant="contained" autoFocus>
                        Zapisz
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog edycji lokalizacji */}
            <Dialog
                open={openLocationDialog}
                onClose={handleCloseLocationDialog}
                aria-labelledby="edit-location-dialog-title"
                sx={{
                    "& .MuiDialog-paper": {
                        borderRadius: "16px",
                        padding: "16px",
                    },
                }}
            >
                <DialogTitle
                    id="edit-location-dialog-title"
                    sx={{
                        padding: "16px 24px",
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                    }}
                >
                    Edytuj lokalizację
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
                        type="number"
                        label="Długość geograficzna"
                        value={coordinates.long ?? ""}
                        onChange={(e) => {
                            setCoordinates({ ...coordinates, long: parseFloat(e.target.value) });
                        }}
                        fullWidth
                        variant="outlined"
                        disabled={isUpdatingGatewayInfo}
                    />
                    <TextField
                        type="number"
                        label="Szerokość geograficzna"
                        value={coordinates.lat ?? ""}
                        onChange={(e) => {
                            setCoordinates({ ...coordinates, lat: parseFloat(e.target.value) });
                        }}
                        fullWidth
                        variant="outlined"
                        disabled={isUpdatingGatewayInfo}
                    />
                </DialogContent>
                <DialogActions sx={{ padding: "8px 24px" }}>
                    <Button onClick={handleCloseLocationDialog} color="primary" disabled={isUpdatingGatewayInfo}>
                        Anuluj
                    </Button>
                    <Button
                        onClick={handleSaveLocation}
                        color="success"
                        variant="contained"
                        autoFocus
                    >
                        Zapisz
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StationList;
