import {createSlice, PayloadAction} from '@reduxjs/toolkit';



export interface MetamaskState {
    status: string
    account: string
    metamaskData:any,
    metamaskStatus:string
}

const initialState: MetamaskState = {} as MetamaskState;

export const MetamaskSlice = createSlice({
    name: 'upload',
    initialState,
    reducers: {
        setStatus: (state, action: PayloadAction<string>) => {
            state.status = action.payload;
        },
        setAccount: (state, action: PayloadAction<string>) => {
            state.account = action.payload;
        }
    },
})



export const { setStatus, setAccount } = MetamaskSlice.actions
export default MetamaskSlice.reducer