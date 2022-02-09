import {isRejectedWithValue, isFulfilled, Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { API_ENDPOINT } from '../../constants';
import {statsStorage} from "./Stats";
import {retrieveError} from "../../utils/error";

interface DefaultResponse {
    stat:Object
}


//InitiateValidateAddress
export interface InitiateValidateAddressArgs {
    address: string
}

export interface InitiateValidateAddressResponse extends DefaultResponse {
    success: boolean
    message: string | null
    nonce: string | null
    error: string | null
}

//ValidateAddress
export interface ValidateAddressArgs {
    address: string
    message: string
    nonce: string
    signature: string
}


interface ValidateAddressResponse extends DefaultResponse {
    success: boolean
    coordinates: Array<Array<number>> | null
    error: string | null
}

//GenerateChainImage
export interface GenerateChainImageArgs {
    generate_chain_image: string
    image_name: string
}


interface GenerateChainImageResponse extends DefaultResponse {
    success: boolean
    chain_image: string
    error: string | null
}

//PushImage
interface PushImageResponse extends DefaultResponse {
    success: boolean
    image_uri: string
    error: string | null
}

const FantomPixelsAPI = createApi({
    reducerPath: 'fantomPixelsAPI',
    baseQuery: fetchBaseQuery({baseUrl: `${API_ENDPOINT}/`}),
    endpoints: (builder) => ({
        auth: builder.query<string, null>({
            query: () => ({url:'test-auth/', method: 'GET'}),
        }),
        authValidateAddress: builder.query<InitiateValidateAddressResponse, InitiateValidateAddressArgs>({
            query: (arg) => ({
                url:'test-auth/auth-validate-address',
                method: 'POST',
                body:{...arg, stat:statsStorage.getStats()},
            })
        }),
        validateAddress: builder.query<ValidateAddressResponse, ValidateAddressArgs>({
            query: (arg) => ({
                url:'test-auth/validate-address',
                method: 'POST',
                body:{...arg, stat:statsStorage.getStats()}
            })
        }),
        generateChainImage: builder.query<GenerateChainImageResponse, GenerateChainImageArgs>({
            query: (arg) => ({
                url:'test-img/generate-chain-image',
                method: 'POST',
                body:{...arg, stat:statsStorage.getStats()},
            })
        }),
        pushImage: builder.query<PushImageResponse, null>({
            query: (arg) => ({
                url:'/test-ipfs/push-image',
                method: 'POST',
                body:{stat:statsStorage.getStats()}
            })
        }),

    })
})


export const statsHandler: Middleware =
    (api: MiddlewareAPI) => (next) => (action) => {
        if (isFulfilled(action)) {
            if (action.payload && action.payload.hasOwnProperty('stat')) {
                statsStorage.setStats(action.payload.stat)
            }
        }
        return next(action)
}


export const rtkQueryErrorLogger: Middleware =
    (api: MiddlewareAPI) => (next) => (action) => {
        // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these use matchers!
        if (isRejectedWithValue(action)) {
            //api.dispatch(showMainErrorDialog({title:'API ERROR', message: retrieveError(action.payload)}))
            console.error('Error Accrued',  retrieveError(action.payload))
        }
        return next(action)
    }

export default FantomPixelsAPI