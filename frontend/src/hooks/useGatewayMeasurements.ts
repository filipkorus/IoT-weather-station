import { apiPathBase } from "@/config/constants";
import { useState, useEffect } from "react";

interface Returns {
    data: {
        measurements: [] | null;
    };
    error: string | null;
    isLoading: boolean;
}

const useGatewayMeasurements = (id: string): Returns => {
    const [data, setData] = useState(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log("id:");
        console.log(id);

        if (!id) return;

        const now = new Date();
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(now.getFullYear() - 2);

        const startDate = twoYearsAgo.toISOString();
        const endDate = now.toISOString();
        const url = `${apiPathBase}/measurements/gateway/${id}?startDate=${startDate}&endDate=${endDate}`;
        console.log("url:");
        console.log(url);

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                setData(result);
            } catch (err) {
                if (err instanceof Error) {
                    console.error("Fetch error:", err.message); // Type-safe access to `message`
                    setError(err.message);
                } else {
                    console.error("Unknown error:", err); // Handle unknown error
                    setError("An unknown error occurred.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    return { data, error, isLoading };
};

export default useGatewayMeasurements;
