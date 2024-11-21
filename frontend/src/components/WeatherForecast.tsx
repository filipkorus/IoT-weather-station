import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import { WeatherData } from "@/types/Weather.ts";
import fetchWeatherPrediction from "@/utils/fetchWeatherPrediction.ts";
import { useParams } from "react-router-dom";
import { useGetPublicGatewayQuery } from "@/services/gateway";

const WeatherForecast: React.FC = () => {
    const id = useParams().id;
    const { data: gatewayData } = useGetPublicGatewayQuery({ gatewayId: id ?? "" });
    const [latLong, setLatLong] = useState<{ latitude: number; longitude: number }>({
        latitude: 49.989,
        longitude: 19.984,
    });
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (gatewayData?.gateway?.latitude && gatewayData?.gateway?.longitude) {
            setLatLong({ latitude: gatewayData?.gateway.latitude, longitude: gatewayData?.gateway.longitude });
        }
    }, [gatewayData]);

    useEffect(() => {
        fetchWeatherPrediction(latLong).then(({ data: weatherData, error }) => {
            if (error && error instanceof Error) {
                setError("Błąd w zapytaniu API: " + error.message);
                setLoading(false);
                return;
            }
            if (!(weatherData && "hourly" in weatherData && "daily" in weatherData)) {
                setError("Brak danych.");
                setLoading(false);
                return;
            }
            setWeatherData(weatherData);
            setLoading(false);
        });
    }, [latLong]);

    if (loading) return <div>Ładowanie danych...</div>;
    if (error) return <div>{error}</div>;

    const precipitationProbabilityMax = weatherData?.daily.precipitationProbabilityMax[0]
        ? weatherData?.daily.precipitationProbabilityMax[0].toFixed(0)
        : "0";

    const weatherCode = weatherData?.hourly.weatherCode[0];
    let icon;
    switch (weatherCode) {
        case 0:
            icon = "☀️"; // Clear sky
            break;
        case 1:
        case 2:
        case 3:
            icon = "🌤️"; // Mainly clear, partly cloudy, overcast
            break;
        case 45:
        case 48:
            icon = "🌫️"; // Fog and depositing rime fog
            break;
        case 51:
        case 53:
        case 55:
            icon = "🌧️"; // Drizzle (light, moderate, dense)
            break;
        case 56:
        case 57:
            icon = "❄️"; // Freezing Drizzle (light, dense)
            break;
        case 61:
        case 63:
        case 65:
            icon = "🌧️"; // Rain (slight, moderate, heavy)
            break;
        case 66:
        case 67:
            icon = "❄️🌧️"; // Freezing Rain (light, heavy)
            break;
        case 71:
        case 73:
        case 75:
            icon = "❄️"; // Snowfall (slight, moderate, heavy)
            break;
        case 77:
            icon = "🌨️"; // Snow grains
            break;
        case 80:
        case 81:
        case 82:
            icon = "🌧️"; // Rain showers (slight, moderate, violent)
            break;
        case 85:
        case 86:
            icon = "🌨️"; // Snow showers (slight, heavy)
            break;
        case 95:
            icon = "🌩️"; // Thunderstorm (slight, moderate)
            break;
        case 96:
        case 99:
            icon = "🌩️⚡"; // Thunderstorm with hail (slight, heavy)
            break;
        default:
            icon = "🌥️"; // Other
            break;
    }

    const visibilityRaw = weatherData?.hourly.visibility[0] ?? 0;
    const visibility = visibilityRaw > 1000 ? `${(visibilityRaw / 1000).toFixed(1)} km` : `${visibilityRaw} m`;
    return (
        <Grid item xs={12} sm={6} md={6} lg={6}>
            <Paper
                elevation={3}
                sx={{
                    boxShadow: 5,
                    padding: "20px",
                    height: "80%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                    flexDirection: "row",
                }}
            >
                {/* Ikona pogody */}
                <Box sx={{ textAlign: "center", marginRight: 2 }}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: {
                                xs: "2rem",
                                sm: "2.5rem",
                                md: "3rem",
                            },
                        }}
                    >
                        {icon}
                    </Typography>
                </Box>

                {/* Widoczność */}
                <Box sx={{ textAlign: "center", marginRight: 2 }}>
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: {
                                xs: "0.875rem",
                                sm: "1rem",
                                md: "1.25rem",
                            },
                        }}
                    >
                        Widoczność:
                    </Typography>
                    <Typography
                        variant="h4"
                        sx={{
                            fontSize: {
                                xs: "1rem",
                                sm: "1.5rem",
                                md: "2rem",
                            },
                        }}
                    >
                        {visibility}
                    </Typography>
                </Box>

                {/* Prawdopodobieństwo opadów */}
                <Box sx={{ textAlign: "center" }}>
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: {
                                xs: "0.875rem",
                                sm: "1rem",
                                md: "1.25rem",
                            },
                        }}
                    >
                        Prawd. opadów:
                    </Typography>
                    <Typography
                        variant="h4"
                        sx={{
                            fontSize: {
                                xs: "1rem",
                                sm: "1.5rem",
                                md: "2rem",
                            },
                        }}
                    >
                        {precipitationProbabilityMax}%
                    </Typography>
                </Box>
            </Paper>
        </Grid>
    );
};

export default WeatherForecast;
