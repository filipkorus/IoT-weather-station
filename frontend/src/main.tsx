import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { SocketProvider } from "./context/SocketContext.tsx";
import { SnackbarProvider } from "./context/SnackbarProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <SnackbarProvider>
                <SocketProvider>
                    <App />
                </SocketProvider>
            </SnackbarProvider>
        </Provider>
    </React.StrictMode>,
);
