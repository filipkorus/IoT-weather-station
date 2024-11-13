import { SocketContext } from "@/context/SocketContext";
import { useContext } from "react";

// custom hook to use the WebSocket context
export const useSocket = (): WebSocket | null => {
    const socket = useContext(SocketContext);
    if (!socket && socket !== null) {
        console.log("socket:");
        console.log(socket);

        throw new Error("useSocket must be used within a SocketProvider");
    }
    return socket;
};
