import { useLoginMutation, UsernamePassword } from "@/services/auth";
import { useSnackbar } from "../useSnackbar";
import { useEffect } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useNavigate } from "react-router-dom";
import { gatewayApi } from "@/services/gateway";
import { useDispatch } from "react-redux";

const useLogin = () => {
    const [loginAction, { isLoading: isLoggingIn, isSuccess, isError, error }] = useLoginMutation();
    const showSnackbar = useSnackbar();
    const navigate = useNavigate();

    const login = async ({ username, password }: UsernamePassword) => {
        const response = await loginAction({ username, password });
        const token = response?.data?.token;
        if (token) {
            localStorage.setItem("token", token);
        }
    };

    const dispatch = useDispatch();

    useEffect(() => {
        if (isSuccess) {
            // reload private stations when switching user
            dispatch(gatewayApi.util.invalidateTags([{ type: "Gateway", id: "PRIVATE_LIST" }]));

            showSnackbar("", "success");
            showSnackbar("Poprawnie zalogowano!", "success");
            navigate("/account");
        }

        if (isError) {
            if ((error as FetchBaseQueryError)?.status) {
                const { status } = error as FetchBaseQueryError;
                switch (status) {
                    case 400:
                        showSnackbar("Podano nieprawidłowe dane!", "error");
                        break;
                    case 401:
                        showSnackbar("Zły login lub hasło!", "error");
                        break;
                    default:
                        showSnackbar("Wystąpił błąd przy logowaniu!", "error");
                        break;
                }
            } else {
                showSnackbar("Wystąpił błąd przy logowaniu!", "error");
            }
        }
    }, [isSuccess, isError, showSnackbar, error, navigate]);

    return {
        isLoggingIn,
        login,
    };
};

export default useLogin;
