import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "@/components/BackButton.tsx";
import ChartSkeleton from "@/components/ChartSkeleton.tsx";
import useGatewayMeasurements from "@/hooks/useGatewayMeasurements";
import { normalizeData } from "@/utils/normalizeData";

const HumidityPage: React.FC = () => {
    const id = useParams().id;
    const navigate = useNavigate();
    const { data } = useGatewayMeasurements(id ?? "");
    return (
        <div>
            <BackButton title="Powrót" onClick={() => navigate(`/slopedata/${id}`)}></BackButton>
            <ChartSkeleton title="Wilgotność" unit="%" data={normalizeData(data?.measurements ?? [], "humidity")} />
        </div>
    );
};
export default HumidityPage;
