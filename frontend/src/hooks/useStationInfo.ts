import { useGetPublicGatewayQuery } from "@/services/gateway";
import { getLiveData } from "@/store/slices/liveDataSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface HomePageData {
    created: string;
    name: string;
    temperature: number;
    humidity: number;
    pressure: number;
    snowDepth: number;
    pm1: number;
    pm25: number;
    pm10: number;
}

const useStationInfo = (id: string | undefined): any => {
    const navigate = useNavigate();

    // Redirect immediately if `id` is undefined
    if (!id) {
        navigate("/");
    }

    // Use the `skip` option to prevent the query from running if `id` is undefined
    const { data, error, isLoading } = useGetPublicGatewayQuery({ gatewayId: id as string }, { skip: !id });

    const liveData = useSelector(getLiveData);

    const stationInfo: Partial<HomePageData> = {
        name: data?.gateway.name,
        ...(id ? { temperature: liveData?.[id]?.data[0]?.temperature } : {}),
        ...(id ? { humidity: liveData?.[id]?.data[0]?.humidity } : {}),
        ...(id ? { pressure: liveData?.[id]?.data[0]?.pressure } : {}),
        ...(id ? { snowDepth: liveData?.[id]?.data[0]?.snowDepth } : {}),
        ...(id ? { pm1: liveData?.[id]?.data[0]?.pm1 } : {}),
        ...(id ? { pm25: liveData?.[id]?.data[0]?.pm25 } : {}),
        ...(id ? { pm10: liveData?.[id]?.data[0]?.pm10 } : {}),
        ...(id ? { created: liveData?.[id]?.data[0]?.created } : {}),
    };

    return stationInfo;
};

export default useStationInfo;
