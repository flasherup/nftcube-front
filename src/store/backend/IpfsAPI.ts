import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {IPFS_ENDPOINT} from "../../constants";

export interface IpfsArgs {
    img_hash: string
}
export interface IpfsResponse {
    image: string
    success: string
    error?:string
}

const IpfsAPI = createApi({
    reducerPath: 'ipfsAPI',
    baseQuery: fetchBaseQuery({baseUrl: `${IPFS_ENDPOINT}/`}),
    endpoints: (builder) => ({
        getImage: builder.query<IpfsResponse, IpfsArgs>({
            query: (arg) => ({
                url:'ipfs',
                method: 'POST',
                body:arg,
                responseHandler: (response) => response.json()
            }),
            transformResponse: (response: Object):IpfsResponse => {
                const ipfs = response as IpfsResponse;
                if (ipfs.image) {
                    ipfs.image = 'data:image/png;base64,' + ipfs.image;
                }
                return ipfs;
            },
        }),
    }),
})

export default IpfsAPI
export const {
    useGetImageQuery,
    useLazyGetImageQuery,
} = IpfsAPI