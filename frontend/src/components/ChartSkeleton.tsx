import React, { useState } from "react";
import { Box, Typography, Radio, RadioGroup, FormControlLabel, FormControl, useMediaQuery } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, Cell } from "recharts";
import formatChartData from "@/utils/formatChartData.ts";
import { useParams } from "react-router-dom";
import { useIsItMyStation } from "@/hooks/useIsItMyStation";

// Określamy typy dla danych
export interface DataEntry {
    created: Date;
    value: number | null;
}

interface ChartSkeletonProps {
    title: string;
    unit: string;
    data: { [key: string]: DataEntry[] };
}

export type Intervals = "24h" | "7d" | "30d" | "1y" | "2y";

const ChartSkeleton: React.FC<ChartSkeletonProps> = ({ title, unit, data }) => {
    const [timeRange, setTimeRange] = useState<Intervals>("24h");
    const handleTimeRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTimeRange(event.target.value as Intervals);
    };

    // Sprawdzamy, czy użytkownik jest zalogowany
    const isLoggedIn = localStorage.getItem("token") !== null;

    // Funkcja do formatuowania etykiet na podstawie zakresu
    const selectedData = formatChartData<DataEntry>(data[timeRange], timeRange);
    const params = useParams();
    // const dupa = useHistoricalData({ gatewayId: params.id ?? "", property, timeRange });
    const isItMyStation = useIsItMyStation(params.id ?? "");

    // Sprawdzamy, czy ekran jest mały (xs, sm, md)
    const isSmallScreen = useMediaQuery("(max-width: 700px)");
    const isMediumScreen = useMediaQuery("(max-width: 1024px)");

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>

            <FormControl component="fieldset" sx={{ marginBottom: 3 }}>
                <Typography variant="body1">Wybierz zakres czasowy:</Typography>
                <RadioGroup row value={timeRange} onChange={handleTimeRangeChange} sx={{ gap: 2 }}>
                    <FormControlLabel value="24h" control={<Radio />} label="Ostatnie 24h" />
                    <FormControlLabel value="7d" control={<Radio />} label="Ostatnie 7 dni" />
                    <FormControlLabel value="30d" control={<Radio />} label="Ostatnie 30 dni" />
                    {isLoggedIn && isItMyStation && (
                        <>
                            <FormControlLabel value="1y" control={<Radio />} label="Ostatni rok" />
                            <FormControlLabel value="2y" control={<Radio />} label="Ostatnie 2 lata" />
                        </>
                    )}
                </RadioGroup>
            </FormControl>

            <Box
                sx={{
                    padding: 2,
                    overflowX: isSmallScreen || isMediumScreen ? "auto" : "unset", // Dodanie scrolla w osi X na małych ekranach
                    WebkitOverflowScrolling: "touch", // Optymalizacja dla iOS
                }}
            >
                <BarChart
                    width={1200}
                    height={400}
                    data={selectedData}
                    margin={{ top: 20, right: 30, bottom: 69 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="name"
                        interval={0} // Ustawiamy interval na 0, aby wszystkie etykiety były widoczne
                        angle={-45}
                        textAnchor="end"
                    />
                    <YAxis tickFormatter={(value: number) => `${value} ${unit}`} />
                    <Bar dataKey="value" fill="#8884d8">
                        {selectedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#9bcce5" : "#7ca6c4"} />
                        ))}
                        <LabelList dataKey="value" position="top" />
                    </Bar>
                </BarChart>
            </Box>
        </Box>
    );
};

export default ChartSkeleton;
