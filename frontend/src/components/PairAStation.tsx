import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
} from "@mui/material";

const PairAStation: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [code, setCode] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCode("");
    };

    const handleSubmit = () => {
        console.log("Wprowadzony kod:", code);
        handleClose();
    };

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={handleClickOpen}
                sx={{
                    padding: "12px 24px",
                    fontSize: "1rem",
                    borderRadius: "8px",
                    backgroundColor: "#0d598f",
                    "&:hover": {
                        backgroundColor: "#084a73",
                    },
                }}
            >
                Sparuj Nową Stację
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Wprowadź kod</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            Wprowadź kod
                        </Typography>
                        <TextField
                            autoFocus
                            margin="dense"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={code}
                            onChange={(e) => setCode(e.target.value)} // Aktualizacja stanu kodu
                            inputProps={{ maxLength: 6 }} // Ograniczenie do 6 znaków
                            sx={{
                                position: "relative",
                                "&::before": {
                                    content: '"_ _ _ _ _ _"',
                                    position: "absolute",
                                    left: 0,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#ccc", // Kolor podkreślników
                                    pointerEvents: "none",
                                    fontSize: "1.2rem", // Rozmiar czcionki
                                },
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Anuluj
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Zatwierdź
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PairAStation;
