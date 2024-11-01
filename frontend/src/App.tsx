import {Route, BrowserRouter, Routes} from "react-router-dom";
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

const App = () => {
	return <BrowserRouter>
		<Routes>
			<Route path="/" element={<EntryPage/>}/>
			<Route path="/login" element={<LoginPage/>} />
			<Route path="/register" element={<RegisterPage/>} />
			<Route path="/slopedata" element={<HomePage/>}/>
			<Route path="/humidity" element={<HumidityPage />} />
			<Route path="/pressure" element={<PressurePage/>} />
			<Route path="/temperature" element={<TemperaturePage/>} />
			<Route path="/snow" element={<SnowPage/>} />
			<Route path="/airquality" element={<AirQualityPage/>} />

		</Routes>
	</BrowserRouter>;
}

export default App;
