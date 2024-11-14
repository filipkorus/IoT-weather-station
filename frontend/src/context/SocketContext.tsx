import React, { createContext, useEffect, useState, ReactNode } from "react";
import { wsPathBase } from "@/config/constants";

const SOCKET_URL = wsPathBase; // Include token as a query parameter

export type SocketContextType = {
    socket: WebSocket | null;
    sendMessage: (_: string) => void;
};

// Define the context type (WebSocket or null initially)
export const SocketContext = createContext<SocketContextType>({
    socket: null,
    sendMessage: () => {},
});

// Define types for the props of SocketProvider
interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        if (socket === null) {
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

            // // Define the onmessage event listener for receiving data
            // socketInstance.onmessage = (event) => {
            //     const data = JSON.parse(event.data);
            //     console.log("Received message:", data);
            // };
        }

        // Clean up the WebSocket connection when the component unmounts
        return () => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, [socket]);

    // Define sendMessage function to send data if the WebSocket is open
    const sendMessage = (message: string) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(message);
        } else {
            console.error("WebSocket is not open. Cannot send message:", message);
        }
    };

    return <SocketContext.Provider value={{ socket, sendMessage }}>{children}</SocketContext.Provider>;
};
