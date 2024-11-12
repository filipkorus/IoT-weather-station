import React from "react";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/BackButton.tsx";
import ChartSkeleton from "@/components/ChartSkeleton.tsx";

const TemperaturePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Typography variant="h2">
        To jest podstrona na ktorej bedzie wykres tempartauty!
      </Typography>
      <BackButton
        title="Powrót"
        onClick={() => navigate("/slopedata")}
      ></BackButton>
        <ChartSkeleton/>
    </div>
  );
};

export default TemperaturePage;
