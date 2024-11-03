import React from "react";
import { Button, Box, Typography } from "@mui/material";

interface ButtonsProps {
  title: string;
  value?: number;
  unit?: string;
  onClick: () => void;
}

const Buttons: React.FC<ButtonsProps> = ({ title, value, unit, onClick }) => {
  return (
    <Button
      variant="contained"
      fullWidth
      sx={{
        backgroundColor: "#0d598f",
        boxShadow: 5,
        padding: "20px",
        textAlign: "center",
        height: "80%",
        "&:hover": {
          backgroundColor: "#1f4152", // Zmiana koloru po najechaniu
        },
      }}
      onClick={onClick}
    >
      <Box>
        <Typography
          variant="h6"
          sx={{ fontSize: { xs: "1.1rem", sm: "2rem" } }}
        >
          {title}
        </Typography>
        <Typography
          variant="h2"
          sx={{ textTransform: "none", fontSize: { xs: "1.5rem", sm: "2rem" } }}
        >
          {value} {unit}
        </Typography>
      </Box>
    </Button>
  );
};

export default Buttons;
