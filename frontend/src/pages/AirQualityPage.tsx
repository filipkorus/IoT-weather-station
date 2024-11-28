import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "@/components/BackButton.tsx";
import AirChart from "@/components/AirChart.tsx";
import { normalizeAirQuality } from "@/utils/normalizeAirQuality";
import useGatewayMeasurements from "@/hooks/useGatewayMeasurements";
const airData = {
    "24h": [
        { created: new Date(Date.now() - 0 * 60 * 60 * 1000), pm1: 10, pm2_5: 15, pm10: 20 },
        { created: new Date(Date.now() - 6 * 60 * 60 * 1000), pm1: 12, pm2_5: 18, pm10: 22 },
        { created: new Date(Date.now() - 12 * 60 * 60 * 1000), pm1: 14, pm2_5: 20, pm10: 25 },
        { created: new Date(Date.now() - 18 * 60 * 60 * 1000), pm1: 13, pm2_5: 17, pm10: 21 },
        { created: new Date(Date.now() - 24 * 60 * 60 * 1000), pm1: 15, pm2_5: 19, pm10: 23 },
    ],
    "7d": [
        { created: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), pm1: 10, pm2_5: 15, pm10: 20 },
        { created: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), pm1: 12, pm2_5: 17, pm10: 21 },
        { created: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), pm1: 13, pm2_5: 18, pm10: 22 },
        { created: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), pm1: 14, pm2_5: 19, pm10: 23 },
        { created: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), pm1: 12, pm2_5: 16, pm10: 20 },
        { created: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), pm1: 11, pm2_5: 14, pm10: 19 },
        { created: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), pm1: 12, pm2_5: 15, pm10: 21 },
    ],
    "30d": [
        { created: new Date(new Date().setDate(1)), pm1: 10, pm2_5: 15, pm10: 20 },
        { created: new Date(new Date().setDate(2)), pm1: 11, pm2_5: 16, pm10: 21 },
        { created: new Date(new Date().setDate(3)), pm1: 12, pm2_5: 17, pm10: 22 },
        { created: new Date(new Date().setDate(4)), pm1: 14, pm2_5: 19, pm10: 23 },
        { created: new Date(new Date().setDate(5)), pm1: 13, pm2_5: 18, pm10: 22 },
        { created: new Date(new Date().setDate(6)), pm1: 12, pm2_5: 17, pm10: 21 },
        { created: new Date(new Date().setDate(7)), pm1: 15, pm2_5: 20, pm10: 25 },
        { created: new Date(new Date().setDate(8)), pm1: 14, pm2_5: 19, pm10: 24 },
        { created: new Date(new Date().setDate(9)), pm1: 16, pm2_5: 21, pm10: 26 },
        { created: new Date(new Date().setDate(10)), pm1: 13, pm2_5: 18, pm10: 23 },
        { created: new Date(new Date().setDate(11)), pm1: 14, pm2_5: 19, pm10: 24 },
        { created: new Date(new Date().setDate(12)), pm1: 12, pm2_5: 17, pm10: 22 },
        { created: new Date(new Date().setDate(13)), pm1: 11, pm2_5: 16, pm10: 21 },
        { created: new Date(new Date().setDate(14)), pm1: 15, pm2_5: 20, pm10: 25 },
        { created: new Date(new Date().setDate(15)), pm1: 14, pm2_5: 19, pm10: 23 },
        { created: new Date(new Date().setDate(16)), pm1: 13, pm2_5: 18, pm10: 22 },
        { created: new Date(new Date().setDate(17)), pm1: 12, pm2_5: 17, pm10: 21 },
        { created: new Date(new Date().setDate(18)), pm1: 13, pm2_5: 18, pm10: 22 },
        { created: new Date(new Date().setDate(19)), pm1: 11, pm2_5: 16, pm10: 20 },
        { created: new Date(new Date().setDate(20)), pm1: 14, pm2_5: 19, pm10: 23 },
        { created: new Date(new Date().setDate(21)), pm1: 15, pm2_5: 20, pm10: 24 },
        { created: new Date(new Date().setDate(22)), pm1: 12, pm2_5: 17, pm10: 21 },
        { created: new Date(new Date().setDate(23)), pm1: 13, pm2_5: 18, pm10: 22 },
        { created: new Date(new Date().setDate(24)), pm1: 14, pm2_5: 19, pm10: 23 },
        { created: new Date(new Date().setDate(25)), pm1: 11, pm2_5: 16, pm10: 20 },
        { created: new Date(new Date().setDate(26)), pm1: 12, pm2_5: 17, pm10: 21 },
        { created: new Date(new Date().setDate(27)), pm1: 14, pm2_5: 19, pm10: 23 },
        { created: new Date(new Date().setDate(28)), pm1: 15, pm2_5: 20, pm10: 24 },
        { created: new Date(new Date().setDate(29)), pm1: 16, pm2_5: 21, pm10: 25 },
        { created: new Date(new Date().setDate(30)), pm1: 12, pm2_5: 17, pm10: 22 },
    ],
    "1y": [
        { created: new Date("2024-01-01"), pm1: 10, pm2_5: 15, pm10: 20 },
        { created: new Date("2024-02-01"), pm1: 11, pm2_5: 16, pm10: 21 },
        { created: new Date("2024-03-01"), pm1: 12, pm2_5: 17, pm10: 22 },
        { created: new Date("2024-04-01"), pm1: 13, pm2_5: 18, pm10: 23 },
        { created: new Date("2024-05-01"), pm1: 14, pm2_5: 19, pm10: 24 },
        { created: new Date("2024-06-01"), pm1: 15, pm2_5: 20, pm10: 25 },
        { created: new Date("2024-07-01"), pm1: 13, pm2_5: 18, pm10: 23 },
        { created: new Date("2024-08-01"), pm1: 16, pm2_5: 21, pm10: 26 },
        { created: new Date("2024-09-01"), pm1: 14, pm2_5: 19, pm10: 24 },
        { created: new Date("2024-10-01"), pm1: 12, pm2_5: 17, pm10: 22 },
        { created: new Date("2024-11-01"), pm1: 13, pm2_5: 18, pm10: 23 },
        { created: new Date("2024-12-01"), pm1: 14, pm2_5: 19, pm10: 24 },
    ],
    "2y": [
        { created: new Date("2023-01-01"), pm1: 10, pm2_5: 15, pm10: 20 },
        { created: new Date("2023-02-01"), pm1: 11, pm2_5: 16, pm10: 21 },
        { created: new Date("2023-03-01"), pm1: 12, pm2_5: 17, pm10: 22 },
        { created: new Date("2023-04-01"), pm1: 13, pm2_5: 18, pm10: 23 },
        { created: new Date("2023-05-01"), pm1: 14, pm2_5: 19, pm10: 24 },
        { created: new Date("2023-06-01"), pm1: 15, pm2_5: 20, pm10: 25 },
        { created: new Date("2023-07-01"), pm1: 13, pm2_5: 18, pm10: 23 },
        { created: new Date("2023-08-01"), pm1: 16, pm2_5: 21, pm10: 26 },
        { created: new Date("2023-09-01"), pm1: 14, pm2_5: 19, pm10: 24 },
        { created: new Date("2023-10-01"), pm1: 12, pm2_5: 17, pm10: 22 },
        { created: new Date("2023-11-01"), pm1: 13, pm2_5: 18, pm10: 23 },
        { created: new Date("2023-12-01"), pm1: 14, pm2_5: 19, pm10: 24 },
        { created: new Date("2024-01-01"), pm1: 10, pm2_5: 15, pm10: 20 },
        { created: new Date("2024-02-01"), pm1: 11, pm2_5: 16, pm10: 21 },
        { created: new Date("2024-03-01"), pm1: 12, pm2_5: 17, pm10: 22 },
        { created: new Date("2024-04-01"), pm1: 13, pm2_5: 18, pm10: 23 },
        { created: new Date("2024-05-01"), pm1: 14, pm2_5: 19, pm10: 24 },
        { created: new Date("2024-06-01"), pm1: 15, pm2_5: 20, pm10: 25 },
        { created: new Date("2024-07-01"), pm1: 13, pm2_5: 18, pm10: 23 },
        { created: new Date("2024-08-01"), pm1: 16, pm2_5: 21, pm10: 26 },
        { created: new Date("2024-09-01"), pm1: 14, pm2_5: 19, pm10: 24 },
        { created: new Date("2024-10-01"), pm1: 12, pm2_5: 17, pm10: 22 },
        { created: new Date("2024-11-01"), pm1: 13, pm2_5: 18, pm10: 23 },
        { created: new Date("2024-12-01"), pm1: 14, pm2_5: 19, pm10: 24 },
    ],
};

const AirQualityPage: React.FC = () => {
    const id = useParams().id;
    const navigate = useNavigate();
    const { data } = useGatewayMeasurements(id ?? "");
    return (
        <div>
            <BackButton title="Powrót" onClick={() => navigate(`/slopedata/${id}`)}></BackButton>
            <AirChart title="Jakość powietrza" unit="&nbsp;&nbsp;&nbsp;µg/m3" data={normalizeAirQuality(data?.measurements ?? [])} />
        </div>
    );
};

export default AirQualityPage;
