import { Route, BrowserRouter, Routes } from "react-router-dom";
import HomePage from "@/pages/HomePage.tsx";
import HumidityPage from "@/pages/HumidityPage.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import React from "react";
import RegisterPage from "@/pages/RegisterPage.tsx";
import PressurePage from "@/pages/PressurePage.tsx";
import TemperaturePage from "@/pages/TemperaturePage.tsx";
import SnowPage from "@/pages/SnowPage.tsx";
import AirQualityPage from "@/pages/AirQualityPage.tsx";
import EntryPage from "@/pages/EntryPage.tsx";
import AccountPage from "@/pages/AccountPage.tsx";
import { useSocket } from "./hooks/useSocket";
import useHandleDataFromSocket from "./hooks/useHandleDataFromSocket";

const App: React.FC = () => {
    const { socket } = useSocket();
    useHandleDataFromSocket(socket);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<EntryPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/slopedata/:id" element={<HomePage />} />
                <Route path="/humidity/:id" element={<HumidityPage />} />
                <Route path="/pressure/:id" element={<PressurePage />} />
                <Route path="/temperature/:id" element={<TemperaturePage />} />
                <Route path="/snow/:id" element={<SnowPage />} />
                <Route path="/airquality/:id" element={<AirQualityPage />} />
                <Route path="/account" element={<AccountPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
