import React from "react";
import { Box, Typography } from "@mui/material";

interface BannerProps {
    message: string;
}

const Banner: React.FC<BannerProps> = ({ message }) => {
    return (
        <Box
            sx={{
                backgroundColor: "#0d598f",
                padding: "1%",
                textAlign: "center",
                marginBottom: "1%",
                borderRadius: "8px",
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    color: "white",
                    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                }}
            >
                {message}
            </Typography>
        </Box>
    );
};

export default Banner;
