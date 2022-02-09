import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {ASSETS_ENDPOINT} from "../../constants";

import {AssetAttribute, NSStore} from "../NonSerializableStore";

const AssetsAPI = createApi({
    reducerPath: 'AssetsAPI',
    baseQuery: fetchBaseQuery({baseUrl: `${ASSETS_ENDPOINT}/`}),
    endpoints: (builder) => ({
        getMainImage: builder.query<string, string>({
            query: () => ({
                url:noCache('64pxTileImageExample.png'),
                responseHandler: (response) => response.blob()
            }),
            transformResponse: (response: Blob) => {
                return URL.createObjectURL(response);
            },
        }),
        getAttributes: builder.query<number, string>({
            query: () => ({
                url:noCache('attributes.json'),
                responseHandler: (response) => response.json(),

            }),
            transformResponse: (response: any) => {
                let map = new Map<string, AssetAttribute>()
                for (let key in response) {
                    if (key) {
                        map.set(key,response[key]);
                    }
                }
                return NSStore.setAssetAttribute(map);
            },
        }),
        getOwners: builder.query<number, string>({
            query: () => ({
                url:noCache('owners.json'),
                responseHandler: (response) => response.json(),
            }),
            transformResponse: (response: any) => {
                let map = new Map<string, string>()
                for (let key in response) {
                    let value = response[key];
                    if (value) {
                        value = (value as string).toLowerCase();
                        map.set(key,value);
                    }
                }
                return NSStore.setAssetOwners(map);
            },
        }),
        getRoadmapImage: builder.query<string, string>({
            query: () => ({
                url:'fantompixels_roadmap.png',
                responseHandler: (response) => response.blob()
            }),
            transformResponse: (response: Blob) => {
                return URL.createObjectURL(response);
            },
        }),
    }),
})

export default AssetsAPI
export const {
    useLazyGetMainImageQuery,
    useLazyGetAttributesQuery,
    useLazyGetOwnersQuery,
    useGetRoadmapImageQuery,
} = AssetsAPI

const noCache = (url:string):string => {
    return url + '?' + Math.round(Math.random()*1000000).toString();
}
