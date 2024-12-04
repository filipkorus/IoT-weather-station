import React, { useState } from "react";
import {
    Box,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    useMediaQuery,
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, Cell, TooltipProps } from "recharts";
import formatChartData from "@/utils/formatChartData.ts";
import { useParams } from "react-router-dom";
import { useIsItMyStation } from "@/hooks/useIsItMyStation";

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

    const isLoggedIn = localStorage.getItem("token") !== null;
    const params = useParams();
    const isItMyStation = useIsItMyStation(params.id ?? "");

    // Media query for responsiveness
    const isSmallScreen = useMediaQuery("(max-width: 700px)");
    const isMediumScreen = useMediaQuery("(max-width: 1024px)");

    // Format and round data before rendering
    const selectedData = formatChartData<DataEntry>(data[timeRange], timeRange).map((entry) => ({
        ...entry,
        value: entry.value !== null ? Math.round(entry.value) : null
    }));

    // Custom Tooltip component
    const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Box
                    sx={{
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        padding: 2,
                        borderRadius: 4,
                        boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {label}
                    </Typography>
                    <Typography variant="body2">
                        Wartość: <strong>{payload[0].value}{unit==="%"?"":" "}{unit}</strong>
                    </Typography>
                </Box>
            );
        }
        return null;
    };

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
                    overflowX: isSmallScreen || isMediumScreen ? "auto" : "unset",
                    WebkitOverflowScrolling: "touch",
                }}
            >
                <BarChart
                    width={1200}
                    height={400}
                    data={selectedData}
                    margin={{ top: 25, right: 30, bottom: 69 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="name"
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                    />
                    <YAxis
                        tick={{ fontSize: 15, dy: 0 }}
                        tickFormatter={(value: number) => `${value}`} // Show only numerical values
                        label={{
                            value: unit,
                            angle: 0,
                            position: "top",
                            offset: 10,
                            style: { fontSize: 16, fill: "#666" },
                        }}
                    />
                    <Tooltip content={<CustomTooltip />} />
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
