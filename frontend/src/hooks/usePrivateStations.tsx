import { useGetAllPrivateGatewaysQuery } from "@/services/gateway";
import { DisplayStation, getIcon } from "./usePublicStations";

const usePrivateStations = (): DisplayStation => {
    const { data, error, isLoading } = useGetAllPrivateGatewaysQuery();

    if (isLoading) {
        return [];
    }

    if (error) {
        if (window?.location?.pathname !== "/account") {
            alert("An error occurred while fetching the slopes data");
        }
        return [];
    }

    if (!data) {
        return [];
    }

    return data.gateways.map((station, index) => ({
        name: station.name,
        icon: getIcon(index),
        id: station.id,
    }));
};

export default usePrivateStations;
