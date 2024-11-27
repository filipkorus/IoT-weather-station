import React, { useEffect } from "react";
import Grid from "@mui/material/Unstable_Grid2"; // For Grid 2.0
import Paper from "@mui/material/Paper";
import { Typography, Box, Button } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Buttons from "@/components/Buttons";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "@/components/BackButton";
import useStationInfo from "@/hooks/useStationInfo";
import useLikes from "@/hooks/useLikes";
import WeatherForecast from "@/components/WeatherForecast";
import { useDispatch } from "react-redux";
import { setIdFromURL } from "@/store/slices/sendLikeSlice";
import isNumeric from "@/utils/isNumeric";

const HomePage: React.FC = () => {
    // id from url params, redirects to '/' if not provided
    const id = useParams().id;
    const stationInfo = useStationInfo(id);
    const { likes, disableButton, haveYouLiked, likeAction } = useLikes(id);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setIdFromURL(id));
    }, [id, dispatch]);

    const noData = "brak danych";

    const stationInfoForDisplay = {
        name: stationInfo?.name != null ?? "Nazwa stoku",
        humidity: stationInfo?.humidity != null ? Math.round(stationInfo?.humidity) : noData,
        pressure: stationInfo?.pressure != null ? Math.round(stationInfo?.pressure) : noData,
        pm1: stationInfo?.pm1 != null ? Math.round(stationInfo?.pm1) : noData,
        pm25: stationInfo?.pm25 != null ? Math.round(stationInfo?.pm25) : noData,
        pm10: stationInfo?.pm10 != null ? Math.round(stationInfo?.pm10) : noData,
        temperature: stationInfo?.temperature != null ? Math.round(stationInfo?.temperature) : noData,
        snowDepth: stationInfo?.snowDepth != null ? Math.round(stationInfo?.snowDepth) : noData,
        likes: likes != null ? likes : noData,
        created: stationInfo.created,
    };

    const navigate = useNavigate();

    return (
        <Box
            padding={3}
            sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#9bcce5",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: "90vh",
                overflowY: "hidden",
            }}
        >
            <Grid container spacing={3} rowSpacing={{ xs: 3, sm: 2, md: 5 }}>
                <Grid xs={12} sm={6} md={12} lg={12} sx={{ height: "30%" }}>
                    {/*<Paper elevation={3} sx={{backgroundColor: '#9bcce5', boxShadow: 5, padding: '20px', height: '30%' }}>*/}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        {/* Nazwa stoku po lewej stronie */}
                        <Typography variant="h5" sx={{ color: "white" }}>
                            <>{stationInfoForDisplay.name}</>
                        </Typography>
                        <BackButton title="Powrót" onClick={() => navigate("/")}></BackButton>
                    </Box>
                    {/*</Paper>*/}
                </Grid>

                <Grid xs={6} sm={6} md={3} lg={3}>
                    <Buttons
                        title="Wilgotność"
                        value={stationInfoForDisplay.humidity}
                        unit="%"
                        onClick={() => navigate(`/humidity/${id}`)}
                    />
                </Grid>

                {/* Square Tile - Pressure */}
                <Grid xs={6} sm={6} md={3}>
                    <Buttons
                        title="Ciśnienie"
                        value={stationInfoForDisplay.pressure}
                        unit="hPa"
                        onClick={() => navigate(`/pressure/${id}`)}
                    />
                </Grid>

                {/* Long Tile - PM Levels */}
                <Grid xs={12} md={6}>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            typography: {
                                xs: "h4",
                                sm: "h6",
                                md: "h5",
                                lg: "h4",
                                xl: "h3",
                            },
                            backgroundColor: "#0d598f",
                            boxShadow: 5,
                            padding: "20px",
                            height: "80%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            "&:hover": {
                                backgroundColor: "#1f4152",
                            },
                        }}
                        onClick={() => navigate(`/airquality/${id}`)}
                    >
                        {/* Box dla pm 1.0 */}
                        <Box sx={{ textAlign: "center", flex: 1 }}>
                            <Typography variant="body2">pm 1.0</Typography>
                            <Typography
                                sx={{
                                    typography: {
                                        xs: "h4",
                                        sm: "h6",
                                        md: "h5",
                                        lg: "h4",
                                        xl: "h3",
                                    },
                                }}
                            >
                                {stationInfoForDisplay.pm1}
                            </Typography>
                            {isNumeric(stationInfoForDisplay.pm25) && (
                                <Typography
                                    sx={{
                                        typography: {
                                            xs: "body1",
                                            sm: "h6",
                                            md: "h5",
                                            lg: "h4",
                                            xl: "h3",
                                        },
                                        textTransform: "none",
                                    }}
                                >
                                    µg/m³
                                </Typography>
                            )}
                        </Box>

                        {/* Box dla pm 2.5 */}
                        <Box sx={{ textAlign: "center", flex: 1 }}>
                            <Typography variant="body2">pm 2.5</Typography>
                            <Typography
                                sx={{
                                    typography: {
                                        xs: "h4",
                                        sm: "h6",
                                        md: "h5",
                                        lg: "h4",
                                        xl: "h3",
                                    },
                                }}
                            >
                                {stationInfoForDisplay.pm25}
                            </Typography>
                            {isNumeric(stationInfoForDisplay.pm25) && (
                                <Typography
                                    sx={{
                                        typography: {
                                            xs: "body1",
                                            sm: "h6",
                                            md: "h5",
                                            lg: "h4",
                                            xl: "h3",
                                        },
                                        textTransform: "none",
                                    }}
                                >
                                    µg/m³
                                </Typography>
                            )}
                        </Box>

                        {/* Box dla pm 10 */}
                        <Box sx={{ textAlign: "center", flex: 1 }}>
                            <Typography variant="body2">pm 10</Typography>
                            <Typography
                                sx={{
                                    typography: {
                                        xs: "h4",
                                        sm: "h6",
                                        md: "h5",
                                        lg: "h4",
                                        xl: "h3",
                                    },
                                }}
                            >
                                {stationInfoForDisplay.pm10}
                            </Typography>
                            {isNumeric(stationInfoForDisplay.pm25) && (
                                <Typography
                                    sx={{
                                        typography: {
                                            xs: "body1",
                                            sm: "h6",
                                            md: "h5",
                                            lg: "h4",
                                            xl: "h3",
                                        },
                                        textTransform: "none",
                                    }}
                                >
                                    µg/m³
                                </Typography>
                            )}
                        </Box>
                    </Button>
                </Grid>

                {/* Square Tile - Temperature */}
                <Grid xs={6} sm={6} md={3}>
                    <Buttons
                        title="Temperatura"
                        value={stationInfoForDisplay.temperature}
                        unit="°C"
                        onClick={() => navigate(`/temperature/${id}`)}
                    />
                </Grid>

                {/* Square Tile - Snow Level */}
                <Grid xs={6} sm={6} md={3}>
                    <Buttons
                        title="Poziom śniegu"
                        value={stationInfoForDisplay.snowDepth}
                        unit="cm"
                        onClick={() => navigate(`/snow/${id}`)}
                    />
                </Grid>

                <Grid xs={12} sm={12} md={6} lg={6}>
                    <WeatherForecast />
                </Grid>

                <Grid xs={12} sm={12} md={12}>
                    <Paper
                        elevation={3}
                        sx={{
                            boxShadow: 5,
                            padding: "20px",
                            textAlign: "center",
                            height: "80%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Box sx={{ width: "100%", mb: 2 }}>
                            <Button
                                variant="contained"
                                fullWidth
                                disabled={disableButton}
                                sx={{
                                    boxShadow: 5,
                                    padding: "20px",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: haveYouLiked ? "#bd0d0d" : "#60020e", // Kolor zmienia się w zależności od stanu
                                    "&:hover": {
                                        backgroundColor: haveYouLiked ? "#bd0d0d" : "#60020e", // Kolor po najechaniu
                                    },
                                }}
                                onClick={likeAction} // Użyj funkcji likeAction
                            >
                                <FavoriteIcon sx={{ marginRight: "8px" }} /> {/* Ikona serca */}
                                <Typography variant="h6">
                                    {haveYouLiked ? "Kliknij, aby cofnąć polubienie" : "Podoba mi się ten stok!"}
                                </Typography>
                            </Button>
                        </Box>

                        {/* Sekcja licznika polubień */}
                        <Box
                            sx={{
                                border: "1px solid",
                                padding: "10px",
                                borderRadius: "5px",
                                width: "50%",
                                textAlign: "center",
                            }}
                        >
                            <Typography variant="body2">Licznik polubień: {stationInfoForDisplay.likes}</Typography>
                        </Box>
                    </Paper>
                </Grid>
                {stationInfoForDisplay.created && (
                    <Typography sx={{ color: "white" }}>
                        Pomiar pobrano:{" "}
                        {new Date(stationInfoForDisplay.created).toLocaleString("pl-PL", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Typography>
                )}
            </Grid>
        </Box>
    );
};

export default HomePage;
