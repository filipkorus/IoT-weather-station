import { useGetAllPublicGatewaysQuery } from "@/services/gateway";
import SnowboardingIcon from "@mui/icons-material/Snowboarding";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import TerrainIcon from "@mui/icons-material/Terrain";

export const getIcon = (index: number) => {
    switch (index % 3) {
        case 0:
            return <SnowboardingIcon />;
        case 1:
            return <AcUnitIcon />;
        case 2:
            return <TerrainIcon />;
        default:
            return <TerrainIcon />;
    }
};

export type DisplayStation = Array<{
    name: string;
    icon: JSX.Element;
    id: string;
    coords: {
        latitude: number | null;
        longitude: number | null;
    },
    nodesBatteryLevel?: {
        nodeId: string;
        batteryLevel: number | null;
    }[]
}>;

const usePublicStations = (): DisplayStation => {
    const { data, error, isLoading } = useGetAllPublicGatewaysQuery();

    if (isLoading) {
        return [];
    }

    if (error) {
        if (window?.location?.pathname !== "/account") {
            alert("An error occurred while fetching the slopes data")
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
        coords: {
            latitude: station.latitude,
            longitude: station.longitude,
        }
    }));
};

export default usePublicStations;
