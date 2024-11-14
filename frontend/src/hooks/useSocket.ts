import { SocketContext, SocketContextType } from "@/context/SocketContext";
import { useContext } from "react";

// custom hook to use the WebSocket context
export const useSocket = (): SocketContextType => {
    const { socket, sendMessage } = useContext(SocketContext);
    if (!socket && socket !== null) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return { socket, sendMessage };
};
