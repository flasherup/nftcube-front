import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ethers} from "ethers";
import FantomPixelsABI from '../../abi/fantompixels_abi.json';
import {
    CONTRACT_INDEX, GAS_LIMIT,
    MINT_PRICE, PROMISE_STATUS_DEFAULT,
    PROMISE_STATUS_FULFILLED,
    PROMISE_STATUS_PENDING,
    PROMISE_STATUS_REJECTED
} from '../../constants';
import {RootState} from "../MainStore";
import {NSStore} from '../NonSerializableStore';
import {EthersError} from "./EthersInterfaces";
import {metamaskStackIntoJson} from "../../utils/error";

export const ETHERS_METHOD_MINT = 'ethers-mint';
export const ETHERS_METHOD_UPDATE_TOKEN_ATTRIBUTE = 'ethers-update-token-attribute';

export interface EthersState {
    ethersInitialized: boolean
    ethersData: number,
    ethersError: number,
    ethersStatus: string
}

export interface EthersArgs {
    method: string
    args?: any[]
}

const initialState: EthersState = {} as EthersState;

type WindowInstanceWithEthereum = Window &
    typeof globalThis & { ethereum?: any };

export const ethersRequest = createAsyncThunk<any, EthersArgs>(
    'ethersFetch',
    async (params, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        if (!state.ethers.ethersInitialized) {
            thunkAPI.rejectWithValue('Ethers Not initialized yet');
            return;
        }

        const etherProvider = NSStore.getWeb3Provider();
        if (!etherProvider) {
            thunkAPI.rejectWithValue('Ethers not found');
            return;
        }

        await etherProvider.send("eth_requestAccounts", []);
        const signer = etherProvider.getSigner();
        let userAddress = await signer.getAddress();
        const contract = new ethers.Contract(CONTRACT_INDEX, FantomPixelsABI, signer);
        if (params.method === ETHERS_METHOD_MINT) {
            const count = params.args?params.args[0]:1
            return await mint(contract, userAddress, count);
        }
        if (params.method === ETHERS_METHOD_UPDATE_TOKEN_ATTRIBUTE) {
            if (params.args && params.args.length < 4) {
                thunkAPI.rejectWithValue('Not enough parameters for updateTokenAttributes call');
            }
            const [tokenId, imageHash, title, url] = params.args as string[];
            return await updateTokenAttributes(contract, tokenId, imageHash, title, url);
        }
        return 'ok';
    }
)

const mint = async (contract: any, address: string, count:number): Promise<Object> => {
    let overrides = {
        //value: ethers.utils.parseEther((MINT_PRICE * count).toString()),
        value: (MINT_PRICE * count).toString(),
        gasLimit: GAS_LIMIT.toString()
    };
    return contract.mint(address, count, overrides);
}

const updateTokenAttributes = async (contract: any, tokenId: string, imageHash: string, title: string, url: string) => {
    await contract.updateTokenAttributes(tokenId, imageHash, title, url);
}


export const EthersSlice = createSlice({
    name: 'ethers',
    initialState,
    reducers: {
        initializeEther: (state) => {
            const ethereum = (window as WindowInstanceWithEthereum).ethereum;
            if (!ethereum) {
                state.ethersStatus = 'Metamask unavailable';
                state.ethersInitialized = false;
            } else {
                const etherProvider = new ethers.providers.Web3Provider(ethereum);
                NSStore.setWeb3Provider(etherProvider);
                state.ethersInitialized = true;
            }
        },
        cleanError: (state) => {
            state.ethersStatus = PROMISE_STATUS_DEFAULT;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(ethersRequest.pending, (state, action) => {
            state.ethersStatus = PROMISE_STATUS_PENDING
        })
        builder.addCase(ethersRequest.fulfilled, (state, action) => {
            state.ethersStatus = PROMISE_STATUS_FULFILLED;
            state.ethersData = NSStore.setEthersData(action.payload);
        })
        builder.addCase(ethersRequest.rejected, (state, action) => {
            state.ethersStatus = PROMISE_STATUS_REJECTED
            let errorData = action.error;
            if (action.error.stack) {
                const json = metamaskStackIntoJson(action.error.stack)
                if (json !== null) {
                    state.ethersError = NSStore.setEthersError(json)
                    return;
                }
            }
            state.ethersError = NSStore.setEthersError(errorData)
        })
    }
})

export default EthersSlice.reducer
export const { initializeEther, cleanError } = EthersSlice.actions