import React from 'react';
// import { Typography } from '@mui/material';
import {useNavigate} from "react-router-dom";
import BackButton from "@/components/BackButton.tsx";
import ChartSkeleton from "@/components/ChartSkeleton.tsx";

const AirQualityPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div>
            <BackButton title="Powrót"
                        onClick={() => navigate('/slopedata')}></BackButton>
            <ChartSkeleton/>
        </div>
    );
};

export default AirQualityPage;