import { useGetPublicGatewayQuery } from "@/services/gateway";
import { getLiveData } from "@/store/slices/liveDataSlice";
import { useSelector } from "react-redux";
import { useSendLike } from "./useSendLike";

const useLikes = (id: string | undefined) => {
    const liveData = useSelector(getLiveData);
    const { data, isFetching, refetch } = useGetPublicGatewayQuery({ gatewayId: id ?? "" });
    const likeAction = useSendLike(id ?? "", refetch, data?.gateway?.haveYouLiked ?? false);

    if (!id) {
        return { likes: undefined, disableButton: true, haveYouLiked: false, likeAction: () => {} };
    }

    const likes = liveData?.[id]?.likes;
    const haveYouLiked = liveData?.[id]?.haveYouLiked;

    return { likes, disableButton: isFetching, haveYouLiked, likeAction };
};

export default useLikes;
