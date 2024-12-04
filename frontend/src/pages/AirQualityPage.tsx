import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "@/components/BackButton.tsx";
import AirChart from "@/components/AirChart.tsx";
import { normalizeAirQuality } from "@/utils/normalizeAirQuality";
import useGatewayMeasurements from "@/hooks/useGatewayMeasurements";

const AirQualityPage: React.FC = () => {
    const id = useParams().id;
    const navigate = useNavigate();
    const { data } = useGatewayMeasurements(id ?? "");
    return (
        <div>
            <BackButton title="Powrót" onClick={() => navigate(`/slopedata/${id}`)}></BackButton>
            <AirChart title="Jakość powietrza" unit="µg/m3" data={normalizeAirQuality(data?.measurements ?? [])} />
        </div>
    );
};

export default AirQualityPage;
