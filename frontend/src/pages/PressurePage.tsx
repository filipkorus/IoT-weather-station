import React from 'react';
import { Typography } from '@mui/material';
import {useNavigate} from "react-router-dom";
import BackButton from "@/components/BackButton.tsx";
import ChartSkeleton from "@/components/ChartSkeleton.tsx";
import { Box } from "@mui/material";
import { normalizeData } from "@/utils/normalizeData";
import useGatewayMeasurements from "@/hooks/useGatewayMeasurements";

const PressurePage: React.FC = () => {
    const navigate = useNavigate();
    const { data } = useGatewayMeasurements(id ?? "");
    return (
        <div>
            <Typography variant="h2">To jest podstrona na ktorej bedzie wykres cisnienia</Typography>
            <BackButton title="Powrót"
                     onClick={() => navigate('/slopedata')}></BackButton>
        </div>
    );
};

export default PressurePage;