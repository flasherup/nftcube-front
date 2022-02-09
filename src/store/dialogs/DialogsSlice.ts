import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { DIALOG_TYPE_MAIN_ERROR } from '../../constants';


export interface MainErrorParams {
    title: string
    message: string
}

export interface DialogsState {
    shown: boolean
    type: string
    mainError: MainErrorParams | null
}



const initialState: DialogsState = {
    shown: false,
    type: ''
} as DialogsState;

export const DialogsSlice = createSlice({
    name: 'dialogs',
    initialState,
    reducers: {
        showDialog: (state, action: PayloadAction<string>) => {
            state.shown = true;
            state.type = action.payload
        },
        showMainErrorDialog: (state, action: PayloadAction<MainErrorParams>) => {
            state.shown = true;
            state.type = DIALOG_TYPE_MAIN_ERROR;
            state.mainError = action.payload
        },
        hideDialog: (state) => {
            state.shown = false;
        }
    },
})

export const { showDialog, hideDialog, showMainErrorDialog } = DialogsSlice.actions
export default DialogsSlice.reducer
