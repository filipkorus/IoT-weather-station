import axios from "axios";
import { WeatherParams } from "@/types/Weather.ts";

const fetchWeatherPrediction = async ({ latitude, longitude }: { latitude: number; longitude: number }) => {
    try {
        const params: WeatherParams = {
            latitude,
            longitude,
            hourly: ["weather_code", "visibility"],
            daily: ["precipitation_probability_max"],
            timezone: "auto",
            forecast_days: 1,
        };

        const url = "https://api.open-meteo.com/v1/forecast";

        const queryString = new URLSearchParams();
        Object.keys(params).forEach((key) => {
            const value = params[key as keyof WeatherParams];
            if (Array.isArray(value)) {
                queryString.append(key, value.join(","));
            } else {
                queryString.append(key, String(value));
            }
        });

        const res = await axios.get(`${url}?${queryString.toString()}`);

        return {
            data: {
                hourly: {
                    time: res.data.hourly.time.map((t: string) => new Date(t)),
                    weatherCode: res.data.hourly.weather_code,
                    visibility: res.data.hourly.visibility,
                },
                daily: {
                    precipitationProbabilityMax: res.data.daily.precipitation_probability_max,
                },
            },
            error: null,
        };
    } catch (error) {
        return { data: null, error };
    }
};

export default fetchWeatherPrediction;
