import React from 'react';
// import { Typography } from '@mui/material';
import {useNavigate} from "react-router-dom";
import BackButton from "@/components/BackButton.tsx";
import AirChart from "@/components/AirChart.tsx";
import { normalizeAirQuality } from "@/utils/normalizeAirQuality";
import useGatewayMeasurements from "@/hooks/useGatewayMeasurements";

const AirQualityPage: React.FC = () => {
    const navigate = useNavigate();
    const { data } = useGatewayMeasurements(id ?? "");
    return (
        <div>
            <BackButton title="Powrót"
                        onClick={() => navigate('/slopedata')}></BackButton>
            <ChartSkeleton/>
        </div>
    );
};

export default AirQualityPage;