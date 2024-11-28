import React, { useState } from "react";
import { Box, Typography, Radio, RadioGroup, FormControlLabel, FormControl, useMediaQuery } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, Cell } from "recharts";
import { Intervals } from "@/components/ChartSkeleton.tsx";
import formatChartData from "@/utils/formatChartData.ts";
import { useParams } from "react-router-dom";
import { useIsItMyStation } from "@/hooks/useIsItMyStation";

export interface DataEntry {
    created: Date;
    pm1: number | null;
    pm2_5: number | null;
    pm10: number | null;
}

interface AirChartProps {
    title: string;
    unit: string;
    data: { [key: string]: DataEntry[] };
}

const AirChart: React.FC<AirChartProps> = ({ title, unit, data }) => {
    const [timeRange, setTimeRange] = useState<Intervals>("24h");
    const [visibleBars, setVisibleBars] = useState({
        pm1: true,
        pm2_5: true,
        pm10: true,
    });

    const handleTimeRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTimeRange(event.target.value as Intervals);
    };

    const toggleBarVisibility = (key: keyof typeof visibleBars) => {
        setVisibleBars((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const isLoggedIn = localStorage.getItem("token") !== null;

    const selectedData = formatChartData<DataEntry>(data[timeRange], timeRange);
    const params = useParams();
    // const results = useHistoricalData({ gatewayId: params.id ?? "", property: ["pm1", "pm25", "pm10"], timeRange });
    const isItMyStation = useIsItMyStation(params.id ?? "");

    // Sprawdzanie, czy ekran jest mały (xs, sm) lub średni (md)
    const isSmallScreen = useMediaQuery("(max-width: 700px)");
    const isMediumScreen = useMediaQuery("(max-width: 1024px)");

    return (
        <Box sx={{ display: "flex", flexDirection: isSmallScreen || isMediumScreen ? "column" : "row", padding: 3 }}>
            <Box sx={{ flex: 1, overflowX: isSmallScreen || isMediumScreen ? "auto" : "visible" }}>
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

                <Box sx={{ padding: 2, overflowX: "auto" }}>
                    <BarChart
                        width={1200}
                        height={400}
                        data={selectedData}
                        margin={{ top: 20, right: 30, bottom: 69 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" />
                        <YAxis
                            tick={{ fontSize: 15, dy: 0 }}
                            tickFormatter={(value: number) => `${value} ${unit.replace('³', '³')}`}
                        />

                        {visibleBars.pm1 && (
                            <Bar dataKey="pm1" fill="#8884d8" name="PM1.0">
                                {selectedData.map((entry, index) => (
                                    <Cell key={`cell-pm1-${index}`} fill="#7ca6c4" />
                                ))}
                                <LabelList dataKey="pm1" position="top" />
                            </Bar>
                        )}

                        {visibleBars.pm2_5 && (
                            <Bar dataKey="pm2_5" fill="#82ca9d" name="PM2.5">
                                {selectedData.map((entry, index) => (
                                    <Cell key={`cell-pm2_5-${index}`} fill="#1f4152" />
                                ))}
                                <LabelList dataKey="pm2_5" position="top" />
                            </Bar>
                        )}

                        {visibleBars.pm10 && (
                            <Bar dataKey="pm10" fill="#ffc658" name="PM10">
                                {selectedData.map((entry, index) => (
                                    <Cell key={`cell-pm10-${index}`} fill="#4dadd9" />
                                ))}
                                <LabelList dataKey="pm10" position="top" />
                            </Bar>
                        )}
                    </BarChart>
                </Box>
            </Box>

            {/* Legenda */}
            <Box
                sx={{
                    width: "150px",
                    marginLeft: 3,
                    marginTop: isSmallScreen || isMediumScreen ? 3 : 0, // Przesuwamy na dół na mniejszych ekranach
                    display: "flex",
                    flexDirection: isSmallScreen || isMediumScreen ? "column" : "column", // Legenda w kolumnie na małych ekranach
                }}
            >
                <Typography variant="body1" gutterBottom>
                    Legenda:
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            opacity: visibleBars.pm1 ? 1 : 0.5,
                        }}
                        onClick={() => toggleBarVisibility("pm1")}
                    >
                        <Box sx={{ width: 20, height: 20, backgroundColor: "#7ca6c4", marginRight: 1 }} />
                        <Typography variant="body2">PM1.0</Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            opacity: visibleBars.pm2_5 ? 1 : 0.5,
                        }}
                        onClick={() => toggleBarVisibility("pm2_5")}
                    >
                        <Box sx={{ width: 20, height: 20, backgroundColor: "#1f4152", marginRight: 1 }} />
                        <Typography variant="body2">PM2.5</Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            opacity: visibleBars.pm10 ? 1 : 0.5,
                        }}
                        onClick={() => toggleBarVisibility("pm10")}
                    >
                        <Box sx={{ width: 20, height: 20, backgroundColor: "#4dadd9", marginRight: 1 }} />
                        <Typography variant="body2">PM10</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default AirChart;
