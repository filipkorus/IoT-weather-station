import { usePairingCodeMutation } from "@/services/privateArea";
import { useSnackbar } from "./useSnackbar";
import { useEffect } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface Props {
    successCallback: () => void;
}

const usePairingCode = ({ successCallback }: Props = { successCallback: () => {} }) => {
    const [pairing, { isLoading: isPairing, isSuccess, isError, error }] = usePairingCodeMutation();
    const showSnackbar = useSnackbar();

    useEffect(() => {
        if (isSuccess) {
            showSnackbar("", "success");
            showSnackbar("Sparowano pomyślnie!", "success");
            if (successCallback) {
                successCallback();
            }
        }

        if (isError) {
            if ((error as FetchBaseQueryError)?.status) {
                const { status } = error as FetchBaseQueryError;
                switch (status) {
                    case 400:
                        showSnackbar("Brakujące lub niewłaście pola zapytania.", "error");
                        break;
                    case 404:
                        showSnackbar("Niepoprawny kod parujący", "error");
                        break;
                    default:
                        showSnackbar("Błąd serwera", "error");
                        break;
                }
            } else {
                showSnackbar("Błąd serwera", "error");
            }
        }
    }, [isSuccess, isError, showSnackbar, error, successCallback]);

    return {
        isPairing,
        pairing,
    };
};

export default usePairingCode;
