import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "@/components/BackButton.tsx";
import ChartSkeleton from "@/components/ChartSkeleton.tsx";
import { normalizeData } from "@/utils/normalizeData";
import useGatewayMeasurements from "@/hooks/useGatewayMeasurements";

const TemperaturePage: React.FC = () => {
    const id = useParams().id;
    const navigate = useNavigate();
    const { data } = useGatewayMeasurements(id ?? "");
    return (
        <div>
            <BackButton title="Powrót" onClick={() => navigate(`/slopedata/${id}`)}></BackButton>
            <ChartSkeleton
                title="Temperatura"
                unit="°C"
                data={normalizeData(data?.measurements ?? [], "temperature")}
            />
        </div>
    );
};

export default TemperaturePage;
