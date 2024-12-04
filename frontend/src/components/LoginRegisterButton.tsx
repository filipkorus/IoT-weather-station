import React from "react";
import { Button, Box, Typography, SxProps } from "@mui/material";

interface LoginRegisterButtonProps {
    title: string;
    onClick: () => void;
    sx?: SxProps;
    variant?: "contained" | "outlined" | "mainPage";
    disabled?: boolean;
}

const LoginRegisterButton: React.FC<LoginRegisterButtonProps> = ({
    title,
    onClick,
    sx,
    variant = "contained",
    disabled = false,
}) => {
    return (
        <Button
            variant={variant === "mainPage" ? "contained" : variant} // use "contained" as the base for "mainPage"
            fullWidth
            disabled={disabled}
            sx={{
                boxShadow: variant === "mainPage" ? 0 : 5, // no shadow for "mainPage"
                textAlign: "center",
                padding: variant === "mainPage" ? "16px 20px" : "8px 12px", // larger padding for "mainPage"
                color: variant === "contained" || variant === "mainPage" ? "white" : "#0d598f",
                marginTop: "1%",
                marginBottom: "1%",
                borderColor: variant === "contained" ? "white" : "#0d598f",
                backgroundColor:
                    variant === "mainPage"
                        ? "#0d598f" // custom background color for "mainPage"
                        : variant === "contained"
                          ? "#9bcce5"
                          : "transparent",
                ...sx,
                "&:hover": {
                    backgroundColor:
                        variant === "mainPage"
                            ? "#063c62" // custom hover color for "mainPage"
                            : variant === "contained"
                              ? "#1f4152"
                              : "#9bcce5",
                },
            }}
            onClick={onClick}
        >
            <Box>
                <Typography variant="body2" sx={{ fontSize: { xs: "0.8rem", sm: "0.8rem", md: "1rem" } }}>
                    {title}
                </Typography>
            </Box>
        </Button>
    );
};

export default LoginRegisterButton;
