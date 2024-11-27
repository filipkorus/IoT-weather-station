import { useLogoutMutation } from "@/services/auth";
import { useSnackbar } from "../useSnackbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
    const [logout, { isLoading: isLoggingOut, isSuccess, isError }] = useLogoutMutation();
    const showSnackbar = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        if (isSuccess) {
            showSnackbar("Poprawnie wylogowano!", "success");
            localStorage.removeItem("token");
            navigate(`/`);
        }

        if (isError) {
            showSnackbar("Wystąpił błąd przy wylogowywaniu!", "error");
        }
    }, [isSuccess, isError, showSnackbar, navigate]);

    return {
        isLoggingOut,
        logout,
    };
};

export default useLogout;
