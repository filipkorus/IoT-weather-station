import React, { useState } from "react";
import { Box, Typography, Radio, RadioGroup, FormControlLabel, FormControl } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, Cell } from "recharts";
import { Intervals } from "@/components/ChartSkeleton.tsx";
import formatChartData from "@/utils/formatChartData.ts";

interface DataEntry {
    created: Date;
    pm1: number;
    pm2_5: number;
    pm10: number;
}

interface AirChartProps {
    title: string;
    unit: string;
    data: { [key: string]: DataEntry[] };
}

const AirChart: React.FC<AirChartProps> = ({ title, unit, data }) => {
    const [timeRange, setTimeRange] = useState<Intervals>("24h");

    const handleTimeRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTimeRange(event.target.value as Intervals);
    };

    // Sprawdzenie, czy użytkownik jest zalogowany
    const isLoggedIn = localStorage.getItem("token") !== null;

    const selectedData = formatChartData<DataEntry>(data[timeRange], timeRange);

    return (
        <Box sx={{ display: "flex", padding: 3 }}>
            <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>

                <FormControl component="fieldset" sx={{ marginBottom: 3 }}>
                    <Typography variant="body1">Wybierz zakres czasowy:</Typography>
                    <RadioGroup row value={timeRange} onChange={handleTimeRangeChange} sx={{ gap: 2 }}>
                        <FormControlLabel value="24h" control={<Radio />} label="Ostatnie 24h" />
                        <FormControlLabel value="7d" control={<Radio />} label="Ostatnie 7 dni" />
                        <FormControlLabel value="30d" control={<Radio />} label="Ostatnie 30 dni" />
                        {isLoggedIn && (
                            <>
                                <FormControlLabel value="1y" control={<Radio />} label="Ostatni rok" />
                                <FormControlLabel value="2y" control={<Radio />} label="Ostatnie 2 lata" />
                            </>
                        )}
                    </RadioGroup>
                </FormControl>

                <Box sx={{ padding: 2 }}>
                    <BarChart
                        width={800}
                        height={400}
                        data={selectedData}
                        margin={{ top: 20, right: 30, left: 30, bottom: 40 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            interval={0} // Ustawiamy interval na 0, aby wszystkie etykiety były widoczne
                            angle={-45}
                            textAnchor="end"
                        />
                        <YAxis tickFormatter={(value: number) => `${value} ${unit}`} />
                        <Tooltip formatter={(value: number | string) => `${value} ${unit}`} />

                        {/* Słupki dla PM1.0 */}
                        <Bar dataKey="pm1" fill="#8884d8" name="PM1.0">
                            {selectedData.map((entry, index) => (
                                <Cell key={`cell-pm1-${index}`} fill="#7ca6c4" />
                            ))}
                            <LabelList dataKey="pm1" position="top" />
                        </Bar>

                        {/* Słupki dla PM2.5 */}
                        <Bar dataKey="pm2_5" fill="#82ca9d" name="PM2.5">
                            {selectedData.map((entry, index) => (
                                <Cell key={`cell-pm2_5-${index}`} fill="#1f4152" />
                            ))}
                            <LabelList dataKey="pm2_5" position="top" />
                        </Bar>

                        {/* Słupki dla PM10 */}
                        <Bar dataKey="pm10" fill="#ffc658" name="PM10">
                            {selectedData.map((entry, index) => (
                                <Cell key={`cell-pm10-${index}`} fill="#0d598f" />
                            ))}
                            <LabelList dataKey="pm10" position="top" />
                        </Bar>
                    </BarChart>
                </Box>
            </Box>

            {/* Legenda po prawej stronie */}
            <Box sx={{ width: "150px", marginLeft: 3 }}>
                <Typography variant="body1" gutterBottom>
                    Legenda:
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ width: 20, height: 20, backgroundColor: "#7ca6c4", marginRight: 1 }} />
                        <Typography variant="body2">PM1.0</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ width: 20, height: 20, backgroundColor: "#1f4152", marginRight: 1 }} />
                        <Typography variant="body2">PM2.5</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ width: 20, height: 20, backgroundColor: "#0d598f", marginRight: 1 }} />
                        <Typography variant="body2">PM10</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default AirChart;
