import { UpdateGatewayInfo, useUpdateGatewayInfoMutation } from "@/services/privateArea";
import { useSnackbar } from "./useSnackbar";
import { useEffect } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { gatewayApi } from "@/services/gateway";
import { useDispatch } from "react-redux";

const useUpdateGatewayInfo = (gatewayId: string, callback: () => void) => {
    const [_updateGatewayInfo, { isLoading: isUpdatingGatewayInfo, isSuccess, isError, error }] =
        useUpdateGatewayInfoMutation();
    const showSnackbar = useSnackbar();

    const updateGatewayInfo = ({ infoToUpdate }: { infoToUpdate: UpdateGatewayInfo }) => {
        _updateGatewayInfo({ infoToUpdate, gatewayId });
    };

    const dispatch = useDispatch();
    useEffect(() => {
        if (isSuccess) {
            // reload stations after changing data
            dispatch(gatewayApi.util.invalidateTags([{ type: "Gateway", id: "PRIVATE_LIST" }]));

            showSnackbar("", "success");
            showSnackbar("Ustawiono pomyślnie!", "success");

            callback();
        }

        if (isError) {
            if ((error as FetchBaseQueryError)?.status) {
                const { status } = error as FetchBaseQueryError;
                switch (status) {
                    case 400:
                        showSnackbar("Brakujące lub niewłaście pola.", "error");
                        break;
                    case 404:
                        showSnackbar(`Nie znaleziono bramy z id=${gatewayId}`, "error");
                        break;
                    default:
                        showSnackbar("Błąd serwera", "error");
                        break;
                }
            } else {
                showSnackbar("Błąd serwera", "error");
            }
        }
    }, [callback, error, isError, isSuccess, showSnackbar]); // don't put gatewayId in here, seemed to break everything

    return {
        updateGatewayInfo,
        isUpdatingGatewayInfo,
    };
};

export default useUpdateGatewayInfo;
