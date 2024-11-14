import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "@/components/BackButton.tsx";
import ChartSkeleton from "@/components/ChartSkeleton.tsx";

const HumidityPage: React.FC = () => {
    const id = useParams().id;
    const navigate = useNavigate();
    return (
        <Box sx={{ padding: 3 }}>
            {/* Przyciski i nagłówek w górnym lewym rogu */}
            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <BackButton title="Powrót" onClick={() => navigate(`/slopedata/${id}`)}></BackButton>
                <Typography variant="h2">To jest podstrona na której bedzie wykres wilgotnosci</Typography>
                <ChartSkeleton />
            </Box>
        </Box>
    );
};

export default HumidityPage;
