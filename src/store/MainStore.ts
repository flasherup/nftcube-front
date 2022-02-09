import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import MetamaskSlice from "./metamask/MetamaskSlice";
import DialogsSlice from "./dialogs/DialogsSlice";
import AssetsAPI from "./backend/AssetsAPI";
import IpfsAPI from "./backend/IpfsAPI";
import FantomPixelsAPI, {rtkQueryErrorLogger, statsHandler} from "./backend/FantomPixelsAPI";
import EthersSlice from "./ethers/EthersSlice";
import FantomPixelsSlice from "./backend/FantomPixelsSlice";

export const MainStore = configureStore({
    reducer: {
        metamask: MetamaskSlice,
        ethers: EthersSlice,
        dialogs: DialogsSlice,
        fantomPixels: FantomPixelsSlice,
        [AssetsAPI.reducerPath]: AssetsAPI.reducer,
        [IpfsAPI.reducerPath]: IpfsAPI.reducer,
        [FantomPixelsAPI.reducerPath]: FantomPixelsAPI.reducer,
    },
    middleware:(getDefaultMiddleware) =>
        getDefaultMiddleware({
        })
            .concat(AssetsAPI.middleware)
            .concat(IpfsAPI.middleware)
            .concat(FantomPixelsAPI.middleware)
            .concat(rtkQueryErrorLogger)
            .concat(statsHandler)
})

setupListeners(MainStore.dispatch)

export type RootState = ReturnType<typeof MainStore.getState>
export type AppDispatch = typeof MainStore.dispatch