import { useGetPublicGatewayQuery } from "@/services/gateway";
import { useNavigate } from "react-router-dom";

const useStationInfo = (id: string | undefined): any => {
    const navigate = useNavigate();

    // Redirect immediately if `id` is undefined
    if (!id) {
        navigate("/");
    }

    // Use the `skip` option to prevent the query from running if `id` is undefined
    const { data, error, isLoading } = useGetPublicGatewayQuery({ gatewayId: id as string }, { skip: !id });

    return { data, error, isLoading };
};

export default useStationInfo;
