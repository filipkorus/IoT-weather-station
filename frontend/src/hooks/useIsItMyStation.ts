import { Gateway, useGetAllPrivateGatewaysQuery } from "@/services/gateway";
import { useMemo } from "react";

const useIsItMyStation = (id: string) => {
    const { data } = useGetAllPrivateGatewaysQuery();

    const isIdInData = useMemo(() => {
        if (!data || !data.gateways) return false;
        return data.gateways.some((gateway: Gateway) => gateway.id === id);
    }, [data, id]);

    return isIdInData; // Return the result for further use
};

export { useIsItMyStation };
