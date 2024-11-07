import { getCounterValue, increment } from "@/store/slices/counterSlice";
import { Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

const ReduxTest = () => {
    const count = useSelector(getCounterValue);
    const dispatch = useDispatch();

    return (
        <>
            <div>{count}</div>
            <Button onClick={() => dispatch(increment(2))}>Increment</Button>
        </>
    );
};

export default ReduxTest;
