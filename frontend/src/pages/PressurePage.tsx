import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "@/components/BackButton.tsx";
import ChartSkeleton from "@/components/ChartSkeleton.tsx";
import { Box } from "@mui/material";
import { normalizeData } from "@/utils/normalizeData";
import useGatewayMeasurements from "@/hooks/useGatewayMeasurements";

const PressurePage: React.FC = () => {
    const id = useParams().id;
    const navigate = useNavigate();
    const { data } = useGatewayMeasurements(id ?? "");
    return (
        <div>
            <BackButton title="Powrót" onClick={() => navigate(`/slopedata/${id}`)}></BackButton>
            <ChartSkeleton title="Ciśnienie" unit="hPa" data={normalizeData(data?.measurements ?? [], "pressure")} />
        </div>
    );
};

export default PressurePage;
