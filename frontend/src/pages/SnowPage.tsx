import React from "react";
import { Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "@/components/BackButton.tsx";
import ChartSkeleton from "@/components/ChartSkeleton.tsx";

const SnowPage: React.FC = () => {
    const id = useParams().id;
    const navigate = useNavigate();
    return (
        <div>
            <Typography variant="h2">To jest podstrona na ktorej bedzie wykres śniegu</Typography>
            <BackButton title="Powrót" onClick={() => navigate(`/slopedata/${id}`)}></BackButton>
            <ChartSkeleton />
        </div>
    );
};

export default SnowPage;
