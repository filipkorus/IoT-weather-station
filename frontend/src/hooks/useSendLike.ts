import { getGatewayId, setGatewayId } from "@/store/slices/sendLikeSlice";
import { useSocket } from "./useSocket";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

export const useSendLike = (gatewayId: string, refetch: () => void, haveYouLiked: boolean) => {
    const { sendMessage } = useSocket();
    const dispatch = useDispatch();
    const [localGid, setLocalGid] = useState("");
    const gatewayIdCloud = useSelector(getGatewayId);

    useEffect(() => {
        if (localGid === gatewayIdCloud) {
            refetch();
            setLocalGid("");
        }
    }, [gatewayId, gatewayIdCloud]); //, refetch]);

    return {
        func: () => {
            setLocalGid(gatewayId);
            dispatch(setGatewayId(""));
            sendMessage(JSON.stringify({ type: haveYouLiked ? "dislike" : "likes", gatewayId }));
        },
        gid: localGid,
    };
};
