import { useGetPublicGatewayQuery } from "@/services/gateway";
import { getLiveData } from "@/store/slices/liveDataSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "./useSocket";
import { getIdFromURL, setGatewayId } from "@/store/slices/sendLikeSlice";

const useLikes = (id: string | undefined) => {
    const liveData = useSelector(getLiveData);
    const { isFetching } = useGetPublicGatewayQuery({ gatewayId: id ?? "" });

    const idFromURL = useSelector(getIdFromURL);
    const dispatch = useDispatch();

    const { sendMessage } = useSocket();
    const likeAction = () => {
        dispatch(setGatewayId(idFromURL));
        sendMessage(JSON.stringify({ type: haveYouLiked ? "dislike" : "likes", gatewayId: id ?? "" }));
    };

    if (!id) {
        return { likes: undefined, disableButton: true, haveYouLiked: false, likeAction: () => {} };
    }

    const likes = liveData?.[id]?.likes;
    const haveYouLiked = liveData?.[id]?.haveYouLiked;

    return { likes, disableButton: isFetching, haveYouLiked, likeAction };
};

export default useLikes;
