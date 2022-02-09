export interface EtherNumber {
    type: string,
    hex: string
}


export interface EthersMintData {
    hash: string
    type: number
    accessList?: []
    blockHash?: string
    blockNumber?:number
    transactionIndex?: number
    confirmations: number
    from: string
    gasPrice: EtherNumber
    gasLimit: EtherNumber
    to: string
    value: EtherNumber
    nonce: number
    data: string
    r: string
    s: string
    v: number
    creates?: string
    chainId?: number
}

export interface EthersError {
    message:string
    stack:any
}