import { getGatewayId, setGatewayId } from "@/store/slices/sendLikeSlice";
import { useSocket } from "./useSocket";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export const useSendLike = (gatewayId: string, refetch: () => void, haveYouLiked: boolean) => {
    const { sendMessage } = useSocket();
    const dispatch = useDispatch();
    const gatewayIdCloud = useSelector(getGatewayId);

    useEffect(() => {
        if (gatewayId === gatewayIdCloud) {
            refetch();
        }
    }, [gatewayId, gatewayIdCloud]); //, refetch]);

    return () => {
        dispatch(setGatewayId(""));
        sendMessage(JSON.stringify({ type: haveYouLiked ? "dislike" : "likes", gatewayId }));
    };
};
