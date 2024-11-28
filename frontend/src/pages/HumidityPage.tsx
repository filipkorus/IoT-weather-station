import React from 'react';
import {Box, Typography} from '@mui/material';
import {useNavigate} from "react-router-dom";
import BackButton from "@/components/BackButton.tsx";
import ChartSkeleton from "@/components/ChartSkeleton.tsx";
import useGatewayMeasurements from "@/hooks/useGatewayMeasurements";
import { normalizeData } from "@/utils/normalizeData";

const HumidityPage: React.FC = () => {
    const navigate = useNavigate();
    const { data } = useGatewayMeasurements(id ?? "");
    return (
        <Box sx={{ padding: 3 }}>
            {/* Przyciski i nagłówek w górnym lewym rogu */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <BackButton title="Powrót"
                    onClick={() => navigate('/slopedata')}></BackButton>
            <Typography variant="h2">To jest podstrona na której bedzie wykres wilgotnosci</Typography>
                <ChartSkeleton/>
            </Box>
        </Box>
    );
};

export default HumidityPage;