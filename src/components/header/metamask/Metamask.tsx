import React, {useCallback, useEffect} from 'react';
import {Button, Image} from "react-bootstrap";
import './css/Metamask.css';
import {useAppDispatch, useAppSelector} from "../../../store/Hooks";
import {RootState} from "../../../store/MainStore";
import {metamaskRequest, METHOD_REQUEST_ACCOUNT} from "../../../store/metamask/MetamaskSlice";
import MetamaskLogo from '../../../images/MetamaskLogo.png';
import {OPERATION_NETWORK_CHAIN_ID} from "../../../constants";

const METAMASK_STATE_DEFAULT = 'default';
const METAMASK_STATE_CONNECTED = 'connected';
const METAMASK_STATE_PENDING = 'pending';
const METAMASK_STATE_ACCOUNT_ERROR = 'account-error';
const METAMASK_STATE_CHAIN_ID_ERROR = 'chain-id-error';

function Metamask() {
    const {account, chainID, metamaskStatus} = useAppSelector((state: RootState) => state.metamask);
    const [state, setState] = React.useState<string>(METAMASK_STATE_DEFAULT);

    const dispatch = useAppDispatch();

    const onMetamaskClick = useCallback(() => {
        dispatch(metamaskRequest({method:METHOD_REQUEST_ACCOUNT}));
    }, []);

    useEffect(() => {
        if (metamaskStatus === 'pending') {
            setState(METAMASK_STATE_PENDING);
        } else if (!account) {
            setState(METAMASK_STATE_ACCOUNT_ERROR);
        } else if (chainID !== OPERATION_NETWORK_CHAIN_ID) {
            setState(METAMASK_STATE_CHAIN_ID_ERROR);
        } else if (account) {
            setState(METAMASK_STATE_CONNECTED);
        } else {
            setState(METAMASK_STATE_DEFAULT);
        }
    }, [account, chainID, metamaskStatus]);

    if (state === METAMASK_STATE_CHAIN_ID_ERROR) {
        return (
            <div className={'metamask metamask-disable d-flex justify-content-start  align-items-center'}>
                <p>WRONG NETWORK</p> <Image src={MetamaskLogo}/>
            </div>
        );
    }

    if (state === METAMASK_STATE_CONNECTED) {
        return (
            <div className={'metamask metamask-disable d-flex justify-content-start  align-items-center'}>
                <p>CONNECTED</p> <Image src={MetamaskLogo}/>
            </div>
        );
    }

    if (state === METAMASK_STATE_PENDING) {
        return (
            <div className={'metamask metamask-disable d-flex justify-content-start  align-items-center'}>
                <p>CONNECTING...</p> <Image src={MetamaskLogo}/>
            </div>
        );
    }

    return (
        <Button onClick={onMetamaskClick} className={'metamask metamask-enable fantom-button d-flex justify-content-start align-items-center'}>
            <p>METAMASK</p> <Image src={MetamaskLogo}/>
        </Button>
    );
}

export default Metamask;