import React, { useState } from "react";
import {
  Box,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
  Paper,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Typ danych
type PressureData = {
  name: string;
  value: number;
};

// Typ dla zakresu danych
type PressureDataRange = {
  "24h": PressureData[];
  "7d": PressureData[];
  "30d": PressureData[];
};

// Mockowe dane dla różnych zakresów
const data: PressureDataRange = {
  "24h": [
    { name: "0h", value: 30 },
    { name: "1h", value: 32 },
    { name: "2h", value: 28 },
    { name: "3h", value: 34 },
    { name: "4h", value: 29 },
    { name: "5h", value: 31 },
    { name: "6h", value: 33 },
    { name: "12h", value: 30 },
    { name: "24h", value: 32 },
  ],
  "7d": [
    { name: "Dzień 1", value: 28 },
    { name: "Dzień 2", value: 29 },
    { name: "Dzień 3", value: 32 },
    { name: "Dzień 4", value: 35 },
    { name: "Dzień 5", value: 30 },
    { name: "Dzień 6", value: 31 },
    { name: "Dzień 7", value: 33 },
  ],
  "30d": [
    { name: "Tydzień 1", value: 30 },
    { name: "Tydzień 2", value: 31 },
    { name: "Tydzień 3", value: 29 },
    { name: "Tydzień 4", value: 32 },
    { name: "Tydzień 5", value: 33 },
    { name: "Tydzień 6", value: 30 },
    { name: "Tydzień 7", value: 28 },
    { name: "Tydzień 8", value: 35 },
    { name: "Tydzień 9", value: 31 },
    { name: "Tydzień 10", value: 32 },
    { name: "Tydzień 11", value: 34 },
    { name: "Tydzień 12", value: 30 },
  ],
};

const ChartSkeleton: React.FC = () => {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h"); // Użycie ograniczonego typu

  // Funkcja zmieniająca zakres czasu
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTimeRange(event.target.value as "24h" | "7d" | "30d"); // Rzutowanie wartości
  };

  // Wybór danych na podstawie wybranego zakresu
  const selectedData = data[timeRange]; // Teraz TypeScript wie, że timeRange jest jednym z kluczy data

  return (
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
          Wykres ciśnienia
        </Typography>

        {/* Grupa radio do wyboru zakresu czasu */}
        <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" }, // Wersja na małych ekranach: kolumnowo, na dużych: poziomo
              gap: 2,
              marginBottom: 2,
              justifyContent: "center", // Wyśrodkowanie na dużych ekranach
            }}
        >
          <RadioGroup
              row
              value={timeRange}
              onChange={handleChange}
              sx={{
                color:"#1f4152",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" }, // Flex column na telefonach
                gap: 2,
              }}
          >
            <FormControlLabel
                control={<Radio />}
                label="Ostatnie 24h"
                value="24h"
            />
            <FormControlLabel
                control={<Radio />}
                label="Ostatnie 7 dni"
                value="7d"
            />
            <FormControlLabel
                control={<Radio />}
                label="Ostatnie 30 dni"
                value="30d"
            />
          </RadioGroup>
        </Box>

        {/* Wykres */}
        <Paper elevation={3} sx={{ padding: 2, backgroundColor: "#f0f0f0" }}>
          <LineChart
              width={window.innerWidth < 600 ? 350 : 600} // Mniejszy wykres na telefonach
              height={300}
              data={selectedData}
              margin={{ top: 5, right: 30,  bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
            />
          </LineChart>
        </Paper>
      </Box>
  );
};

export default ChartSkeleton;
