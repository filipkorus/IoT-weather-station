import { likes, sensorsToClient } from "@/store/slices/liveDataSlice";
import { setGatewayId } from "@/store/slices/sendLikeSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

// Define the type of the data you're receiving via the socket
interface MessageData {
    type: string;
    gatewayId: string;
}

const useHandleDataFromSocket = (socket: WebSocket | null) => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Initialize the WebSocket connection with an authorization token as a query parameter
        if (socket?.readyState !== WebSocket.OPEN) {
            return;
        }

        // Define the onmessage event listener for receiving data
        socket.onmessage = (event) => {
            const data: MessageData = JSON.parse(event.data);
            if (data?.type === "sensors-to-client") {
                dispatch(sensorsToClient(data));
            }
            if (data?.type === "likes") {
                dispatch(likes(data));
                // purpose of like sending
                dispatch(setGatewayId(data.gatewayId));
            }
        };

        // Handle cleanup by closing the WebSocket connection when the component unmounts
        return () => {
            socket.close();
        };
    }, [socket, dispatch]);
};

export default useHandleDataFromSocket;
