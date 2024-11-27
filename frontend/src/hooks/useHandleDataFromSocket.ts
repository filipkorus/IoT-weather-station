import { useGetPublicGatewayQuery } from "@/services/gateway";
import { likes, sensorsToClient } from "@/store/slices/liveDataSlice";
import { getIdFromURL, setGatewayId } from "@/store/slices/sendLikeSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "./useSnackbar";

// Define the type of the data you're receiving via the socket
interface MessageData {
    type: string;
    message?: string;
    gatewayId: string;
}

const useHandleDataFromSocket = (socket: WebSocket | null) => {
    const dispatch = useDispatch();
    const id = useSelector(getIdFromURL);
    const { refetch } = useGetPublicGatewayQuery({ gatewayId: id });
    const showSnackbar = useSnackbar();

    useEffect(() => {
        // Initialize the WebSocket connection with an authorization token as a query parameter
        if (socket?.readyState !== WebSocket.OPEN) {
            return;
        }

        // Define the onmessage event listener for receiving data
        socket.onmessage = (event) => {
            const data: MessageData = JSON.parse(event.data);
            console.log("Received message:", data);
            if (data?.type === "sensors-to-client") {
                dispatch(sensorsToClient(data));
            }
            if (data?.type === "likes") {
                dispatch(likes(data));
                // purpose of like sending
                if (data.gatewayId === id) {
                    refetch();
                    dispatch(setGatewayId(""));
                }
            } else if (data?.type === "likes-error-response") {
                showSnackbar(data?.message ?? "Server error, please refresh the page", "error", 5000);
            } else if (data?.type === "dislike-error-response") {
                showSnackbar(data?.message ?? "Server error, please refresh the page", "error", 5000);
            }
        };

        // Handle cleanup by closing the WebSocket connection when the component unmounts
        return () => {
            socket.close();
        };
    }, [socket, dispatch, id, refetch, showSnackbar]);
};

export default useHandleDataFromSocket;
