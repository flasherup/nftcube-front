import React, {useCallback, useEffect} from 'react';
import {Col, Row} from "react-bootstrap";
import DefaultState from "./states/DefaultState";
import {useAppDispatch, useAppSelector} from "../../../store/Hooks";
import {RootState} from "../../../store/MainStore";
import NotConnectedState from "./states/NotConnectedState";
import './css/Mint.css';
import {
    OPERATION_NETWORK_CHAIN_ID, PROMISE_STATUS_DEFAULT,
    PROMISE_STATUS_FULFILLED,
    PROMISE_STATUS_PENDING,
    PROMISE_STATUS_REJECTED
} from "../../../constants";
import ErrorState from "./states/ErrorState";
import { hideDialog } from '../../../store/dialogs/DialogsSlice';
import {NSStore} from "../../../store/NonSerializableStore";
import CompleteState from "./states/CompleteState";
import {cleanError, ETHERS_METHOD_MINT, ethersRequest} from "../../../store/ethers/EthersSlice";
import {retrieveMetamaskError} from "../../../utils/error";
import SelectorState from "./states/SelectorState";

const MINT_STATE_DEFAULT = 'default';
const MINT_STATE_SELECTOR = 'selector';
const MINT_STATE_COMPLETE = 'complete';
const MINT_STATE_NOT_CONNECTED = 'not-connected';
const MINT_STATE_ERROR = 'error';


function Mint() {
    const {account, chainID} = useAppSelector((state: RootState) => state.metamask);
    const [state, setState] = React.useState<string>(MINT_STATE_DEFAULT);
    const {ethersStatus} = useAppSelector((state: RootState) => state.ethers);
    const [message, setMessage] = React.useState<string>('MINT');


    const dispatch = useAppDispatch();

    useEffect(()=> {
        if (!account || chainID !== OPERATION_NETWORK_CHAIN_ID) {
            setState(MINT_STATE_NOT_CONNECTED);
        } else {
            dispatch(cleanError())
            setState(MINT_STATE_SELECTOR);
        }
    }, [dispatch, account, chainID])

    useEffect(() => {
        if (ethersStatus === PROMISE_STATUS_PENDING) {
            setState(MINT_STATE_DEFAULT)
            setMessage('MINTING...')
        } else if (ethersStatus === PROMISE_STATUS_REJECTED) {
            setState(MINT_STATE_ERROR)
            const dataError = NSStore.getEthersError();
            setMessage(retrieveMetamaskError(dataError))
        } else if (ethersStatus === PROMISE_STATUS_FULFILLED) {
            setState(MINT_STATE_COMPLETE)
        } else if (ethersStatus === PROMISE_STATUS_DEFAULT)  {
            setState(MINT_STATE_SELECTOR)
        }
    }, [ethersStatus]);

    const onMintClick = useCallback((count:number) => {
        dispatch(ethersRequest({
            method:ETHERS_METHOD_MINT,
            args:[count]
        }));
    }, [dispatch]);

    const onOkClick = useCallback(() => {
        dispatch(hideDialog())
    }, [dispatch]);

    const onErrorOkClick = useCallback(() => {
        dispatch(cleanError())
    }, [dispatch]);

    let stateView = <DefaultState message={message}/>
    if (state === MINT_STATE_SELECTOR) stateView = <SelectorState  onMint={onMintClick}/>
    if (state === MINT_STATE_NOT_CONNECTED) stateView = <NotConnectedState />
    if (state === MINT_STATE_ERROR) stateView = <ErrorState error={message} onOkClick={onErrorOkClick}/>
    if (state === MINT_STATE_COMPLETE) stateView = <CompleteState onOkClick={onOkClick}/>

    return (
        <Row className={'mint'}>
            <Col className={'d-flex justify-content-center'}>
                { stateView }
            </Col>
        </Row>
    );
}

export default Mint;