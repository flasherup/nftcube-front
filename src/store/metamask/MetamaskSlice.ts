import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';


export const METHOD_PERSONAL_SING = 'personal_sign';
export const METHOD_ACCOUNTS = 'eth_accounts';
export const METHOD_REQUEST_ACCOUNT = 'eth_requestAccounts';
export const METHOD_CHAIN_ID = 'eth_chainId';

export interface MetamaskState {
    chainID: string
    status: string
    account: string
    signature: string
    metamaskData:any,
    metamaskStatus:string
}

export interface MetamaskArgs {
    method: string
    params?: any[]
}

const initialState: MetamaskState = {} as MetamaskState;

type WindowInstanceWithEthereum = Window &
    typeof globalThis & { ethereum?: any };

export const metamaskRequest = createAsyncThunk<any, MetamaskArgs>(
    'metamskFetch',
    async (params, { rejectWithValue }) => {
        const ethereum = (window as WindowInstanceWithEthereum).ethereum;
        if (!ethereum) {
            return rejectWithValue('Metamask unavailable');
        }
        return ethereum.request(params);
    }
)

export const MetamaskSlice = createSlice({
    name: 'metamask',
    initialState,
    reducers: {
        setChainID: (state, action: PayloadAction<string>) => {
            state.chainID = action.payload;
        },
        setStatus: (state, action: PayloadAction<string>) => {
            state.status = action.payload;
        },
        setAccount: (state, action: PayloadAction<string>) => {
            state.account = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(metamaskRequest.pending, (state, action) => {
            state.metamaskStatus = 'pending'
        })
        builder.addCase(metamaskRequest.fulfilled, (state, action) => {
            state.metamaskStatus = 'fulfilled';
            const { method } = action.meta.arg
            switch(method) {
                case METHOD_REQUEST_ACCOUNT:
                    state.account = action.payload.length > 0?action.payload[0]:undefined;
                    break;
                case METHOD_ACCOUNTS:
                    state.account = action.payload.length > 0?action.payload[0]:undefined;
                    break;
                case METHOD_PERSONAL_SING:
                    state.signature = action.payload;
                    break;
                case METHOD_CHAIN_ID:
                    state.chainID = action.payload;
                    break;
            }
            state.metamaskData = action.payload
        })
        builder.addCase(metamaskRequest.rejected, (state, action) => {
            state.metamaskStatus = 'rejected'
        })
    },
})



export const { setStatus, setAccount, setChainID } = MetamaskSlice.actions
export default MetamaskSlice.reducer