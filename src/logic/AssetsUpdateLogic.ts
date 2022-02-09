import {useLazyGetAttributesQuery, useLazyGetMainImageQuery, useLazyGetOwnersQuery} from "../store/backend/AssetsAPI";
import {useCallback, useEffect} from "react";
import {useAppSelector} from "../store/Hooks";
import {RootState} from "../store/MainStore";
import {CONTRACT_INDEX} from "../constants";
import { EventFilter } from "ethers";
import {NSStore} from "../store/NonSerializableStore";

const filter = {
    address:CONTRACT_INDEX
} as EventFilter

export function AssetsUpdate() {
    const [getMainImageTrigger] = useLazyGetMainImageQuery({});
    const [getAttributesTrigger] = useLazyGetAttributesQuery({});
    const [getOwnersTrigger] = useLazyGetOwnersQuery({});

    const {ethersInitialized} = useAppSelector((state: RootState) => state.ethers);

    const onFilterEvent = useCallback((log, event) => {
        setTimeout(()=>{
            getMainImageTrigger('');
            getAttributesTrigger('');
            getOwnersTrigger('');
        },1000)
    }, [getMainImageTrigger, getAttributesTrigger, getOwnersTrigger]);

    useEffect(() => {
        if (ethersInitialized) {
            const etherProvider = NSStore.getWeb3Provider();
            if (etherProvider) {
                if (etherProvider.listenerCount(filter) === 0) {
                    etherProvider.on(filter, onFilterEvent);
                }

                /*etherProvider.on('poll', (blockNumber)=> {
                    console.log('poll', blockNumber);
                })

                etherProvider.on('block', (blockNumber)=> {
                    console.log('block', blockNumber);
                })

                etherProvider.on('pending', (tx)=> {
                    console.log('pending', tx);
                })*/
            }
        }


        return ()=>{
            const etherProvider = NSStore.getWeb3Provider();
            if (etherProvider) {
                etherProvider.off(filter, onFilterEvent);
            }
        };
    }, [onFilterEvent, ethersInitialized]);

}