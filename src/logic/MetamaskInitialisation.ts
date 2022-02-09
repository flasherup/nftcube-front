import {useAppDispatch, useAppSelector} from "../store/Hooks";
import {useEffect} from "react";
import {
    metamaskRequest,
    METHOD_ACCOUNTS,
    METHOD_CHAIN_ID,
    setAccount,
    setChainID
} from "../store/metamask/MetamaskSlice";
import { showDialog, hideDialog } from "../store/dialogs/DialogsSlice";
import {
    DIALOG_TYPE_METAMASK_CONNECTION,
    DIALOG_TYPE_METAMASK_SIGN,
    DIALOG_TYPE_METAMASK_VALIDATE_CONNECTION,
    DIALOG_TYPE_METAMASK_VALIDATE_SIGN
} from "../constants";
import {RootState} from "../store/MainStore";
import FantomPixelsAPI, {InitiateValidateAddressResponse} from "../store/backend/FantomPixelsAPI";

type WindowInstanceWithEthereum = Window &
    typeof globalThis & { ethereum?: any };

const ethereum = (window as WindowInstanceWithEthereum).ethereum;

export function MetamaskInitialisation() {
    const dispatch = useAppDispatch();
    const {account, signature, metamaskStatus} = useAppSelector((state: RootState) => state.metamask);
    const [initialValidateAddressTrigger, initialValidateAddressResult] = FantomPixelsAPI.useLazyAuthValidateAddressQuery({});
    const [validateAddressTrigger, validateAddressResult] = FantomPixelsAPI.useLazyValidateAddressQuery({});


    //On init show dialog
    useEffect(() => {
        if (ethereum && ethereum.isConnected) {
            ethereum.on('connect', function (connectInfo:any){
                console.log('connect', connectInfo);
            });

            ethereum.on('chainChanged', (chainId:any) => {
                dispatch(setChainID(chainId));
            });

            ethereum.on('accountsChanged', function (accounts:string[]) {
                const newAccount = accounts.length > 0?accounts[0]:undefined;
                if (newAccount)dispatch(setAccount(newAccount));
            });
            dispatch(showDialog(DIALOG_TYPE_METAMASK_CONNECTION));
            dispatch(metamaskRequest({method:METHOD_ACCOUNTS}));
            dispatch(metamaskRequest({method:METHOD_CHAIN_ID}));
        } else {
            console.log('disconnected');
        }
    },[]);

    useEffect(() => {
        if (metamaskStatus !== 'pending') {
            dispatch(hideDialog());
        }
    },[dispatch, metamaskStatus]);

    useEffect(() => {
        if (account) {
            dispatch(showDialog(DIALOG_TYPE_METAMASK_VALIDATE_CONNECTION));
            const address = account as string;
            initialValidateAddressTrigger({address});
        }
    },[account]);
    useEffect(() => {
        if (initialValidateAddressResult) {
            if (initialValidateAddressResult.status === 'fulfilled') {
                dispatch(showDialog(DIALOG_TYPE_METAMASK_SIGN));
                const {message, nonce, success} = initialValidateAddressResult.data as InitiateValidateAddressResponse;
                const m = message !== null?message:'';
                const n = nonce !== null?nonce:'';
                if (success) {
                    const from = account as string;
                    //const params = [
                    //    {
                    //        type: 'string',
                    //        name: 'Message',
                    //        value: m,
                    //    },
                    //    {
                    //        type: 'string',
                    //        name: 'Nunce',
                    //        value: n,
                    //    },
                    //]
                    //const args:singToMetamaskArgs = {method:'eth_signTypedData', args:[params, from]};

                    const msg = `0x${Buffer.from(m, 'utf8').toString('hex')}`;
                    const args = {method:'personal_sign', params:[msg, from, '']};
                    dispatch(metamaskRequest(args));
                }
            }
        }
    },[initialValidateAddressResult]);

    useEffect(() => {
        if (signature) {
            const {message, nonce} = initialValidateAddressResult.data as InitiateValidateAddressResponse;
            dispatch(showDialog(DIALOG_TYPE_METAMASK_VALIDATE_SIGN));
            const address = account as string;
            const args = {
                address: address,
                message: message !== null?message:'',
                nonce: nonce !== null?nonce:'',
                signature: signature
            }
            validateAddressTrigger(args);
        }

    },[signature]);

    useEffect(() => {
        if (validateAddressResult) {
            if (validateAddressResult.status === 'fulfilled') {
                dispatch(hideDialog());
            }
        }
    },[validateAddressResult]);
}