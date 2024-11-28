import React from 'react';
import { Typography } from '@mui/material';
import {useNavigate} from "react-router-dom";
import BackButton from "@/components/BackButton.tsx";
import ChartSkeleton from "@/components/ChartSkeleton.tsx";
import useGatewayMeasurements from "@/hooks/useGatewayMeasurements";
import { normalizeData } from "@/utils/normalizeData";

const SnowPage: React.FC = () => {
    const navigate = useNavigate();
    const { data } = useGatewayMeasurements(id ?? "");
    return (
        <div>
            <Typography variant="h2">To jest podstrona na ktorej bedzie wykres śniegu</Typography>
            <BackButton title="Powrót"
                        onClick={() => navigate('/slopedata')}></BackButton>
        </div>
    );
};

export default SnowPage;