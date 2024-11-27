import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import usePairingCode from "@/hooks/usePairingCode";

const PairAStation: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [code, setCode] = useState("");

    const handleClickOpen = () => {
        setShowForm(true);
    };

    const handleClose = () => {
        setShowForm(false);
        setCode("");
    };

    const { isPairing, pairing } = usePairingCode({ successCallback: handleClose });
    const handleSubmit = () => {
        console.log("Wprowadzony kod:", code.replace(/\s/g, "")); // Usuwanie spacji przed wysłaniem
        pairing(code.replace(/\s/g, ""));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        const formattedValue = value.slice(0, 3) + (value.length > 3 ? " " + value.slice(3, 6) : "");
        setCode(formattedValue);
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

            {/* Formularz wyświetlany tylko gdy `showForm` jest true */}
            {showForm && (
                <Box
                    sx={{
                        width: "90%",
                        // marginTop: "1px",
                        padding: "16px",
                        borderRadius: "16px",
                        boxShadow: 3,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        backgroundColor: "#9bcce5",
                    }}
                >
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Wprowadź kod z urządzenia:
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        type="text"
                        value={code}
                        onChange={handleChange}
                        inputProps={{
                            maxLength: 7,
                            inputMode: "numeric",
                        }}
                        sx={{
                            backgroundColor: "#fdfdfd",
                            width: "100%",
                            borderRadius: "8px",
                            maxWidth: "300px",
                            "& input": {
                                fontSize: "1.5rem",
                                letterSpacing: "0.2rem",
                                textAlign: "center",
                                border: "none",
                                outline: "none",
                            },
                        }}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            maxWidth: "300px",
                            marginTop: "16px",
                        }}
                    >
                        <Button
                            onClick={handleClose}
                            variant="contained"
                            sx={{
                                backgroundColor: "#fdfdfd",
                                width: "48%",
                                borderColor: "#d32f2f",
                                color: "#d32f2f",
                                "&:hover": {
                                    backgroundColor: "#fdecea",
                                },
                            }}
                            disabled={isPairing}
                        >
                            Anuluj
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            sx={{
                                width: "48%",
                                backgroundColor: "#0d598f",
                                "&:hover": {
                                    backgroundColor: "#084a73",
                                },
                            }}
                            disabled={isPairing}
                        >
                            Zatwierdź
                        </Button>
                    </Box>
                </Box>
            )}
        </>
    );
};

export default PairAStation;
