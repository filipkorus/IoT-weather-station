import React, { createContext, useEffect, useState, ReactNode } from "react";
import { wsPathBase } from "@/config/constants";

const SOCKET_URL = wsPathBase; // Include token as a query parameter

// Define the context type (WebSocket or null initially)
export const SocketContext = createContext<WebSocket | null>(null);

// Define types for the props of SocketProvider
interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        // Create a new WebSocket instance
        const socketInstance = new WebSocket(SOCKET_URL);

        socketInstance.onopen = () => {
            console.log("WebSocket connection established");
            setSocket(socketInstance); // Set the WebSocket instance in state
        };

        socketInstance.onclose = () => {
            console.log("WebSocket connection closed");
            setSocket(null); // Clear the socket from state on close
        };

        socketInstance.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        // Clean up the WebSocket connection when the component unmounts
        return () => {
            if (socketInstance.readyState === WebSocket.OPEN) {
                socketInstance.close();
            }
        };
    }, []);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
