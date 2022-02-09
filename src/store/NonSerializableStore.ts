import {Web3Provider} from "@ethersproject/providers/src.ts/web3-provider";
import {EthersError} from "./ethers/EthersInterfaces";

export interface AssetAttribute {
    image_uri: string | null
    title: string | null
    url: string | null
}

export default class NonSerializableStore {
    protected counter = 0;
    protected web3Provider?:Web3Provider;
    protected assetAttributes?:Map<string, AssetAttribute>
    protected assetOwners?:Map<string, string>
    protected ethersData?:any
    protected ethersError?:any

    setWeb3Provider(provider: Web3Provider):number {
        this.web3Provider = provider;
        return this.counter++;
    }

    getWeb3Provider():Web3Provider | undefined {
        return this.web3Provider;
    }

    setAssetAttribute(provider: Map<string, AssetAttribute>):number {
        this.assetAttributes = provider;
        return this.counter++;
    }

    getAssetAttribute():Map<string, AssetAttribute> | undefined {
        return this.assetAttributes;
    }

    setAssetOwners(provider: Map<string, string>):number {
        this.assetOwners = provider;
        return this.counter++;
    }

    getAssetOwners():Map<string, string> | undefined {
        return this.assetOwners;
    }

    setEthersData(data: any):number {
        this.ethersData = data;
        return this.counter++;
    }

    getEthersData():any | undefined {
        return this.ethersData;
    }

    setEthersError(data: any):number {
        this.ethersError = data;
        return this.counter++;
    }

    getEthersError():any | undefined {
        return this.ethersError;
    }
}

export const NSStore = new NonSerializableStore();