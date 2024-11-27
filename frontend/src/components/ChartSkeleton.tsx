import React, { useState } from "react";
import { Box, Typography, Paper, Radio, RadioGroup, FormControlLabel, FormControl } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// Mockowe dane dla różnych zakresów czasowych
const data = {
    "24h": [
        { name: "0h", value: 30 },
        { name: "6h", value: 35 },
        { name: "12h", value: 28 },
        { name: "18h", value: 40 },
        { name: "24h", value: 33 },
    ],
    "7d": [
        { name: "Pon", value: 29 },
        { name: "Wt", value: 34 },
        { name: "Śr", value: 32 },
        { name: "Czw", value: 30 },
        { name: "Pt", value: 35 },
        { name: "Sob", value: 28 },
        { name: "Ndz", value: 33 },
    ],
    "30d": [
        { name: "Tydzień 1", value: 30 },
        { name: "Tydzień 2", value: 31 },
        { name: "Tydzień 3", value: 28 },
        { name: "Tydzień 4", value: 34 },
    ],
    "1y": [
        { name: "Styczeń", value: 32 },
        { name: "Luty", value: 28 },
        { name: "Marzec", value: 34 },
        { name: "Kwiecień", value: 30 },
        { name: "Maj", value: 33 },
        { name: "Czerwiec", value: 31 },
        { name: "Lipiec", value: 29 },
        { name: "Sierpień", value: 35 },
        { name: "Wrzesień", value: 30 },
        { name: "Październik", value: 28 },
        { name: "Listopad", value: 32 },
        { name: "Grudzień", value: 33 },
    ],
};

const ChartSkeleton: React.FC = () => {
    const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "1y">("24h");

    // Funkcja zmieniająca zakres czasu
    const handleTimeRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTimeRange(event.target.value as "24h" | "7d" | "30d" | "1y");
    };

    // Wybór danych na podstawie wybranego zakresu
    const selectedData = data[timeRange];

    return (
        <Box sx={{ padding: 3 }}>
            {/* Kontrolki wyboru zakresu czasu */}
            <FormControl component="fieldset" sx={{ marginBottom: 3 }}>
                <Typography variant="body1">Wybierz zakres czasowy:</Typography>
                <RadioGroup row value={timeRange} onChange={handleTimeRangeChange} sx={{ gap: 2 }}>
                    <FormControlLabel value="24h" control={<Radio />} label="Ostatnie 24h" />
                    <FormControlLabel value="7d" control={<Radio />} label="Ostatnie 7 dni" />
                    <FormControlLabel value="30d" control={<Radio />} label="Ostatnie 30 dni" />
                    <FormControlLabel value="1y" control={<Radio />} label="Sprzed roku" />
                </RadioGroup>
            </FormControl>

            {/* Wykres słupkowy */}
            <Paper elevation={3} sx={{ padding: 2, backgroundColor: "#f0f0f0" }}>
                <BarChart
                    width={600}
                    height={300}
                    data={selectedData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
            </Paper>
        </Box>
    );
};

export default ChartSkeleton;
