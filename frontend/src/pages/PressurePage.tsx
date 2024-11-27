import React from 'react';
import { Typography } from '@mui/material';
import {useNavigate} from "react-router-dom";
import BackButton from "@/components/BackButton.tsx";
import ChartSkeleton from "@/components/ChartSkeleton.tsx";
import { Box } from "@mui/material";
const pressureData = {
    "24h": [
        { created: new Date(Date.now() - 0 * 60 * 60 * 1000), value: 0 }, // "0h" → now
        { created: new Date(Date.now() - 6 * 60 * 60 * 1000), value: 3 }, // "6h" → 6 hours ago
        { created: new Date(Date.now() - 12 * 60 * 60 * 1000), value: 28 }, // "12h" → 12 hours ago
        { created: new Date(Date.now() - 18 * 60 * 60 * 1000), value: 4 }, // "18h" → 18 hours ago
        { created: new Date(Date.now() - 24 * 60 * 60 * 1000), value: 33 }, // "24h" → 24 hours ago
    ],
    "7d": [
        { created: new Date("2024-11-24"), value: 29 }, // "Poniedziałek" → a Monday date (e.g., Nov 24, 2024)
        { created: new Date("2024-11-25"), value: 34 }, // "Wtorek" → Tuesday (Nov 25, 2024)
        { created: new Date("2024-11-26"), value: 12 }, // "Środa" → Wednesday (Nov 26, 2024)
        { created: new Date("2024-11-27"), value: 30 }, // "Czwartek" → Thursday (Nov 27, 2024)
        { created: new Date("2024-11-28"), value: 35 }, // "Piątek" → Friday (Nov 28, 2024)
        { created: new Date("2024-11-29"), value: 28 }, // "Sobota" → Saturday (Nov 29, 2024)
        { created: new Date("2024-11-30"), value: 133 }, // "Niedziela" → Sunday (Nov 30, 2024)
    ],
    "30d": [
        { created: new Date("2024-11-01"), value: 30 }, // "1" → Nov 1, 2024
        { created: new Date("2024-11-02"), value: 3 }, // "2" → Nov 2, 2024
        { created: new Date("2024-11-03"), value: 28 }, // "3" → Nov 3, 2024
        { created: new Date("2024-11-04"), value: 4 }, // "4" → Nov 4, 2024
        { created: new Date("2024-11-05"), value: 32 }, // "5" → Nov 5, 2024
        { created: new Date("2024-11-06"), value: 28 }, // "6" → Nov 6, 2024
        { created: new Date("2024-11-07"), value: 34 }, // "7" → Nov 7, 2024
        { created: new Date("2024-11-08"), value: 0 }, // "8" → Nov 8, 2024
        { created: new Date("2024-11-09"), value: 33 }, // "9" → Nov 9, 2024
        { created: new Date("2024-11-10"), value: 31 }, // "10" → Nov 10, 2024
        { created: new Date("2024-11-11"), value: 29 }, // "11" → Nov 11, 2024
        { created: new Date("2024-11-12"), value: 35 }, // "12" → Nov 12, 2024
        { created: new Date("2024-11-13"), value: 0 }, // "13" → Nov 13, 2024
        { created: new Date("2024-11-14"), value: 28 }, // "14" → Nov 14, 2024
        { created: new Date("2024-11-15"), value: 2 }, // "15" → Nov 15, 2024
        { created: new Date("2024-11-16"), value: 3 }, // "16" → Nov 16, 2024
        { created: new Date("2024-11-17"), value: 30 }, // "17" → Nov 17, 2024
        { created: new Date("2024-11-18"), value: 31 }, // "18" → Nov 18, 2024
        { created: new Date("2024-11-19"), value: 2 }, // "19" → Nov 19, 2024
        { created: new Date("2024-11-20"), value: 34 }, // "20" → Nov 20, 2024
        { created: new Date("2024-11-21"), value: 32 }, // "21" → Nov 21, 2024
        { created: new Date("2024-11-22"), value: 28 }, // "22" → Nov 22, 2024
        { created: new Date("2024-11-23"), value: 3 }, // "23" → Nov 23, 2024
        { created: new Date("2024-11-24"), value: 30 }, // "24" → Nov 24, 2024
        { created: new Date("2024-11-25"), value: 33 }, // "25" → Nov 25, 2024
        { created: new Date("2024-11-26"), value: 31 }, // "26" → Nov 26, 2024
        { created: new Date("2024-11-27"), value: 29 }, // "27" → Nov 27, 2024
        { created: new Date("2024-11-28"), value: 35 }, // "28" → Nov 28, 2024
        { created: new Date("2024-11-29"), value: 30 }, // "29" → Nov 29, 2024
        { created: new Date("2024-11-30"), value: 28 }, // "30" → Nov 30, 2024
    ],
    "1y": [
        { created: new Date("2024-01-01"), value: 2 }, // "Styczeń" → Jan 1, 2024
        { created: new Date("2024-02-01"), value: 28 }, // "Luty" → Feb 1, 2024
        { created: new Date("2024-03-01"), value: 34 }, // "Marzec" → Mar 1, 2024
        { created: new Date("2024-04-01"), value: 30 }, // "Kwiecień" → Apr 1, 2024
        { created: new Date("2024-05-01"), value: 33 }, // "Maj" → May 1, 2024
        { created: new Date("2024-06-01"), value: 31 }, // "Czerwiec" → Jun 1, 2024
        { created: new Date("2024-07-01"), value: 2 }, // "Lipiec" → Jul 1, 2024
        { created: new Date("2024-08-01"), value: 35 }, // "Sierpień" → Aug 1, 2024
        { created: new Date("2024-09-01"), value: 3 }, // "Wrzesień" → Sep 1, 2024
        { created: new Date("2024-10-01"), value: 28 }, // "Październik" → Oct 1, 2024
        { created: new Date("2024-11-01"), value: 32 }, // "Listopad" → Nov 1, 2024
        { created: new Date("2024-12-01"), value: 33 }, // "Grudzień" → Dec 1, 2024
    ],
    "2y": [
        { created: new Date("2024-01-01"), value: 2 }, // "Styczeń" → Jan 1, 2024
        { created: new Date("2024-02-01"), value: 28 }, // "Luty" → Feb 1, 2024
        { created: new Date("2024-03-01"), value: 34 }, // "Marzec" → Mar 1, 2024
        { created: new Date("2024-04-01"), value: 30 }, // "Kwiecień" → Apr 1, 2024
        { created: new Date("2024-05-01"), value: 33 }, // "Maj" → May 1, 2024
        { created: new Date("2024-06-01"), value: 31 }, // "Czerwiec" → Jun 1, 2024
        { created: new Date("2024-07-01"), value: 2 }, // "Lipiec" → Jul 1, 2024
        { created: new Date("2024-08-01"), value: 35 }, // "Sierpień" → Aug 1, 2024
        { created: new Date("2024-09-01"), value: 3 }, // "Wrzesień" → Sep 1, 2024
        { created: new Date("2024-10-01"), value: 28 }, // "Październik" → Oct 1, 2024
        { created: new Date("2024-11-01"), value: 32 }, // "Listopad" → Nov 1, 2024
        { created: new Date("2024-12-01"), value: 33 }, // "Grudzień" → Dec 1, 2024
        { created: new Date("2025-01-01"), value: 32 }, // "Styczeń" → Jan 1, 2025
        { created: new Date("2025-02-01"), value: 8 }, // "Luty" → Feb 1, 2025
        { created: new Date("2025-03-01"), value: 3 }, // "Marzec" → Mar 1, 2025
        { created: new Date("2025-04-01"), value: 3 }, // "Kwiecień" → Apr 1, 2025
        { created: new Date("2025-05-01"), value: 3 }, // "Maj" → May 1, 2025
        { created: new Date("2025-06-01"), value: 371 }, // "Czerwiec" → Jun 1, 2025
        { created: new Date("2025-07-01"), value: 29 }, // "Lipiec" → Jul 1, 2025
        { created: new Date("2025-08-01"), value: 35 }, // "Sierpień" → Aug 1, 2025
        { created: new Date("2025-09-01"), value: 0 }, // "Wrzesień" → Sep 1, 2025
        { created: new Date("2025-10-01"), value: 28 }, // "Październik" → Oct 1, 2025
        { created: new Date("2025-11-01"), value: 2 }, // "Listopad" → Nov 1, 2025
        { created: new Date("2025-12-01"), value: 33 }, // "Grudzień" → Dec 1, 2025
    ],
};

const PressurePage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div>
            <Typography variant="h2">To jest podstrona na ktorej bedzie wykres cisnienia</Typography>
            <BackButton title="Powrót"
                     onClick={() => navigate('/slopedata')}></BackButton>
        </div>
    );
};

export default PressurePage;