import React, { useState } from "react";
import {
    Dialog,
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
        console.log("Wprowadzony kod:", code.replace(/\s/g, "")); // Usuwanie spacji przed wysłaniem
        handleClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Usuwamy wszystko, co nie jest cyfrą
        const value = e.target.value.replace(/[^0-9]/g, "");

        // Dzielimy wartość na dwie grupy: pierwsze 3 cyfry i następne 3
        const formattedValue = value.slice(0, 3) + (value.length > 3 ? " " + value.slice(3, 6) : "");

        setCode(formattedValue); // Zaktualizowanie stanu z nowym formatowaniem
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
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            Wprowadź kod
                        </Typography>
                        <TextField
                            autoFocus
                            margin="dense"
                            type="text"
                            value={code}
                            onChange={handleChange} // Użycie walidacji
                            inputProps={{
                                maxLength: 7, // Maksymalnie 6 cyfr + jedna spacja
                                inputMode: "numeric", // Tylko liczby
                            }}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderColor: "#1f4152",
                                "& .MuiInputBase-root": {
                                    borderRadius: "16px",
                                    backgroundColor: "#ffffff",
                                    padding: "10px 12px",
                                    width: "100%",
                                },
                                "& input": {
                                    fontSize: "2rem",
                                    textColor:"#1f4152",
                                    letterSpacing: "0.2rem", // Większe odstępy między cyframi
                                    textAlign: "center", // Wyśrodkowanie cyfr
                                    border: "none", // Brak obramowania
                                    outline: "none", // Brak obramowania przy fokusu
                                    backgroundColor: "transparent",
                                },
                                "& .MuiInput-underline:before": {
                                    borderBottom: "none",
                                },
                                "& .MuiInput-underline:after": {
                                    borderBottom: "none", // Usuwamy obramowanie
                                },
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "space-between" }}>
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
