import {useAppDispatch, useAppSelector} from "../store/Hooks";
import {useEffect} from "react";
import {RootState} from "../store/MainStore";
import {initializeEther} from "../store/ethers/EthersSlice";

export function MetamaskEthersInitialisation() {
    const dispatch = useAppDispatch();
    const {account} = useAppSelector((state: RootState) => state.metamask);

    useEffect(() => {
        if (account) {
            dispatch(initializeEther())
        }
    },[account]);

}