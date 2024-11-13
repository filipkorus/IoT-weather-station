import { sensorsToClient } from "@/store/slices/liveDataSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

// Define the type of the data you're receiving via the socket
interface MessageData {
    type: string;
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
        };

        // Handle cleanup by closing the WebSocket connection when the component unmounts
        return () => {
            socket.close();
        };
    }, [socket, dispatch]);
};

export default useHandleDataFromSocket;
