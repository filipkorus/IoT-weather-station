import React from 'react';
import { Typography } from '@mui/material';
import {useNavigate} from "react-router-dom";
import BackButton from "@/components/BackButton.tsx";
import ChartSkeleton from "@/components/ChartSkeleton.tsx";

const PressurePage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div>
            <Typography variant="h2">To jest podstrona na ktorej bedzie wykres cisnienia</Typography>
            <BackButton title="Powrót"
                     onClick={() => navigate('/slopedata')}></BackButton>
        </div>
    );
};

export default PressurePage;