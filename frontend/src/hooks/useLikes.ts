import { useGetPublicGatewayQuery } from "@/services/gateway";
import { getLiveData } from "@/store/slices/liveDataSlice";
import { useSelector } from "react-redux";

const useLikes = (id: string | undefined) => {
    const liveData = useSelector(getLiveData);
    const { isFetching, refetch } = useGetPublicGatewayQuery({ gatewayId: id ?? "" });

    if (!id) {
        return { likes: undefined, disableButton: true, haveYouLiked: false, likeAction: () => {} };
    }

    const likes = liveData?.[id]?.likes;
    const haveYouLiked = liveData?.[id]?.haveYouLiked;
    const likeAction = refetch;

    return { likes, disableButton: isFetching, haveYouLiked, likeAction };
};

export default useLikes;
