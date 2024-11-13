export interface WeatherData {
  hourly: {
    time: Date[];
    weatherCode: number[];
    visibility: number[];
  };
  daily: {
    precipitationProbabilityMax: number[];
  };
}

export interface WeatherParams {
  latitude: number;
  longitude: number;
  hourly: string[];
  daily: string[];
  timezone: string;
  forecast_days: number;
}
