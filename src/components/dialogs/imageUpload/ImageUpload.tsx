import React, {useCallback, useEffect, useRef} from 'react';
import EditState, {Attribute} from "./states/EditState";
import LoadingState from "./states/LoadingState";
import {ETHERS_METHOD_UPDATE_TOKEN_ATTRIBUTE, ethersRequest} from "../../../store/ethers/EthersSlice";
import FantomPixelsAPI from "../../../store/backend/FantomPixelsAPI";
import {useAppDispatch, useAppSelector} from "../../../store/Hooks";
import ErrorState from "./states/ErrorState";
import {useLazyGetAttributesQuery, useLazyGetOwnersQuery} from "../../../store/backend/AssetsAPI";
import {RootState} from "../../../store/MainStore";
import {Col, Row} from "react-bootstrap";
import './css/ImageUpload.css'
import {OPERATION_NETWORK_CHAIN_ID, PROMISE_STATUS_FULFILLED, PROMISE_STATUS_REJECTED} from "../../../constants";
import CompleteState from "./states/CompleteState";
import {AssetAttribute, NSStore} from "../../../store/NonSerializableStore";
import {isFulfilled, isRejected, isUninitialized} from "../../../utils/matchers";
import NotConnectedState from "./states/NotConnectedState";
import NotChunksState from './states/NoChunksState';
import {retrieveError, retrieveMetamaskError} from "../../../utils/error";

const UPLOAD_STATE_EDIT = 'default';
const UPLOAD_STATE_UPLOADING = 'uploading';
const UPLOAD_STATE_ERROR = 'error';
const UPLOAD_STATE_COMPLETE = 'complete';
const UPLOAD_STATE_NOT_CONNECTED = 'not-connected';
const UPLOAD_STATE_NO_CHUNKS = 'no-chunks';


function ImageUpload() {
    const selectedAttribute = useRef<Attribute>();
    const [uploadImageTrigger, uploadImageResult] = FantomPixelsAPI.useLazyGenerateChainImageQuery({});
    const [imagePushTrigger, imagePushResult] = FantomPixelsAPI.useLazyPushImageQuery({});
    const [getAttributesTrigger, getAttributesResult] = useLazyGetAttributesQuery({});
    const [getOwnersTrigger, getOwnersResult] = useLazyGetOwnersQuery({});
    const {ethersStatus} = useAppSelector((state: RootState) => state.ethers);
    const [state, setState] = React.useState<string>(UPLOAD_STATE_EDIT);
    const [stateMessage, setStateMessage] = React.useState<string>('UPLOAD IMAGE');
    const [ownAttributes, setOwnAttributes] = React.useState<Attribute[]|null>(null);
    const {account, chainID} = useAppSelector((state: RootState) => state.metamask);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isFulfilled(uploadImageResult)) {
            setState(UPLOAD_STATE_UPLOADING)
            setStateMessage('PUSHING IMAGE');
            imagePushTrigger(null);
        } else if (isRejected(uploadImageResult)) {
            setState(UPLOAD_STATE_ERROR);
            setStateMessage(retrieveError(uploadImageResult.error));
        }
    }, [uploadImageResult, imagePushTrigger]);

    const updateTokenAttributes = useCallback((uri:string | null) => {
        const token = selectedAttribute.current?selectedAttribute.current.token:0;
        const title = selectedAttribute.current?selectedAttribute.current.title:'';
        const url = selectedAttribute.current?selectedAttribute.current.url:'';
        setState(UPLOAD_STATE_UPLOADING)
        setStateMessage('UPDATING FANTOM IMAGE');
        dispatch(ethersRequest({
            method:ETHERS_METHOD_UPDATE_TOKEN_ATTRIBUTE,
            args:[
                token,
                uri,
                title,
                url
            ]
        }));

    }, [dispatch]);

    useEffect(() => {
        if (state === UPLOAD_STATE_UPLOADING) {
            if (isFulfilled(imagePushResult)) {
                const uri = imagePushResult.data?.image_uri;
                if (uri) {
                    updateTokenAttributes(uri);
                } else {
                    setState(UPLOAD_STATE_ERROR);
                    setStateMessage('IMAGE URI NOT FOUND');
                }

            } else if (isRejected(imagePushResult)) {
                setState(UPLOAD_STATE_ERROR);
                setStateMessage(retrieveError(imagePushResult.error));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imagePushResult]);

    useEffect(() => {
        if (state === UPLOAD_STATE_UPLOADING) {
            if (ethersStatus === PROMISE_STATUS_FULFILLED) {
                setState(UPLOAD_STATE_COMPLETE);
                setStateMessage('IMAGE UPLOADED SUCCESSFUL');
            } else if (ethersStatus === PROMISE_STATUS_REJECTED) {
                setState(UPLOAD_STATE_ERROR);
                const ethersError = NSStore.getEthersError()
                if (ethersError && ethersError.message) {
                    const dataError = NSStore.getEthersError();
                    setStateMessage(retrieveMetamaskError(dataError));
                } else {
                    setStateMessage('UPDATE ATTRIBUTES REJECTED');
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ethersStatus]);


    useEffect(() => {
        if (isFulfilled(getAttributesResult) && isFulfilled(getOwnersResult)) {
            const attributes = NSStore.getAssetAttribute();
            const owners = NSStore.getAssetOwners();
            if (attributes && owners) {
                setOwnAttributes(getOwnAttributes(attributes, owners, account));
            }
        }

        if (isUninitialized(getAttributesResult)) {
            getAttributesTrigger('');
        }

        if (isUninitialized(getOwnersResult)) {
            getOwnersTrigger('');
        }

    }, [account, getAttributesTrigger, getAttributesResult, getOwnersTrigger, getOwnersResult]);

    useEffect(()=> {
        if (!account || chainID !== OPERATION_NETWORK_CHAIN_ID) {
            setState(UPLOAD_STATE_NOT_CONNECTED);
        } else if (!ownAttributes) {
            setStateMessage('CHUNKS LOADING...');
            setState(UPLOAD_STATE_UPLOADING);
        } else if (ownAttributes && ownAttributes.length < 1) {
            setState(UPLOAD_STATE_NO_CHUNKS);
        } else {
            setState(UPLOAD_STATE_EDIT);
        }
    }, [account, chainID, ownAttributes])

    const onSave = useCallback((image:string | null, name:string | null, attribute:Attribute) => {
        selectedAttribute.current = attribute;
        setState(UPLOAD_STATE_UPLOADING);
        setStateMessage('UPLOADING IMAGE');
        if (!image || !name) {
            updateTokenAttributes(attribute.image_uri);
            return;
        }
        const args = {
            generate_chain_image: image as string,
            image_name: name as string,
        }
        uploadImageTrigger(args);
    }, [selectedAttribute, uploadImageTrigger, setState, setStateMessage, updateTokenAttributes]);

    const onImageUploadError = useCallback((error:string) => {
        setState(UPLOAD_STATE_ERROR);
        setStateMessage(error);
    }, []);

    const onErrorOkClick = useCallback(() => {
        setState(UPLOAD_STATE_EDIT)
    }, []);

    const onCompleteOkClick = useCallback(() => {
        setState(UPLOAD_STATE_EDIT)
    }, []);

    let view = <LoadingState message={stateMessage} />
    if (state === UPLOAD_STATE_NOT_CONNECTED) view = <NotConnectedState/>
    else if (state === UPLOAD_STATE_NO_CHUNKS) view = <NotChunksState/>
    else if (state === UPLOAD_STATE_EDIT) view = <EditState chunks={ownAttributes?ownAttributes:[]} onSave={onSave} onError={onImageUploadError}/>
    else if (state === UPLOAD_STATE_ERROR) view = <ErrorState error={stateMessage} onOkClick={onErrorOkClick}/>
    else if (state === UPLOAD_STATE_COMPLETE) view = <CompleteState message={stateMessage} onOkClick={onCompleteOkClick}/>

    return (
        <Row className={'image-upload'}>
            <Col>
                {view}
            </Col>
        </Row>
    );
}

export default ImageUpload;

const getOwnAttributes = (attributes:Map<string, AssetAttribute>, owners:Map<string, string>, account:string): Attribute[] => {
    const res:Attribute[] = [];
    owners.forEach((value, key) => {
        if (value) {
            if (value === account) {
                let attr = attributes.get(key);
                if (!attr) {
                    attr = {
                        image_uri: null,
                        title: null,
                        url: null
                    }
                }
                res.push({...attr, token:key})
            }
        }
    })
    return res;
}