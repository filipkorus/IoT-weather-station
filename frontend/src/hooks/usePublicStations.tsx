import { useGetAllPublicGatewaysQuery } from "@/services/gateway";
import SnowboardingIcon from "@mui/icons-material/Snowboarding";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import TerrainIcon from "@mui/icons-material/Terrain";

const getIcon = (index: number) => {
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

const usePublicStations = () => {
    const { data, error, isLoading } = useGetAllPublicGatewaysQuery();

    if (isLoading) {
        return [];
    }

    if (error || !data) {
        alert("An error occurred while fetching the slopes data");
        return [];
    }

    return data.gateways.map((station, index) => ({
        name: station.name,
        icon: getIcon(index),
        id: station.id,
    }));
};

export default usePublicStations;
