import { useRegisterMutation } from "@/services/auth";
import { useSnackbar } from "../useSnackbar";
import { useEffect } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useNavigate } from "react-router-dom";

type CustomErrorData = {
    errors?: { message?: string }[];
};

const useRegister = () => {
    const [register, { isLoading: isRegistering, isSuccess, isError, error }] = useRegisterMutation();
    const showSnackbar = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        if (isSuccess) {
            showSnackbar("Poprawnie zarejestrowano konto!", "success");
            navigate("/login");
        }

        if (isError) {
            if ((error as FetchBaseQueryError)?.status) {
                const { status, data } = error as FetchBaseQueryError & { data: CustomErrorData };
                switch (status) {
                    case 400:
                        showSnackbar(
                            `Podano nieprawidłowe dane! ${data?.errors?.[0]?.message ? data?.errors?.[0]?.message : ""}`,
                            "error",
                            10000,
                        );
                        break;
                    case 409:
                        showSnackbar("Konto o podanej nazwie już istnieje!", "error");
                        break;
                    default:
                        showSnackbar("Wystąpił błąd przy rejestracji!", "error");
                        break;
                }
            } else {
                showSnackbar("Wystąpił błąd przy rejestracji!", "error");
            }
        }
    }, [isSuccess, isError, showSnackbar, error, navigate]);

    return {
        isRegistering,
        register,
    };
};

export default useRegister;
