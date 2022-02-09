import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface FantomPixelsSliceState {
    navigateToken:string
}

const initialState: FantomPixelsSliceState = {} as FantomPixelsSliceState;

export const FantomPixelsSlice = createSlice({
    name: 'fantomPixels',
    initialState,
    reducers: {
        setNavigateToken: (state, action: PayloadAction<string>) => {
            state.navigateToken = action.payload;
        }
    },
})


export const { setNavigateToken } = FantomPixelsSlice.actions
export default FantomPixelsSlice.reducer