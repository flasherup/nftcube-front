import React, {useEffect, useState} from 'react';
import {Button, Col, Row} from 'react-bootstrap';
import {
    DIALOG_TYPE_FULL_SIZE_CANVAS,
    DIALOG_TYPE_IMAGE_UPLOAD,
    DIALOG_TYPE_MINT,
    SECTION_ID_MAIN_IMAGE
} from '../../../constants';
import './css/MainImage.css'
import {useAppDispatch} from "../../../store/Hooks";
import {showDialog} from "../../../store/dialogs/DialogsSlice";
import Grid from "../../common/grid/Grid";
import {useLazyGetOwnersQuery} from "../../../store/backend/AssetsAPI";
import {NSStore} from "../../../store/NonSerializableStore";
import {isFulfilled, isUninitialized} from "../../../utils/matchers";

interface ImagePropertiesState {
    width:number
    height:number
}

const MAX_IMAGE_WIDTH = 870;
const MAX_IMAGE_HEIGHT = 870;

const IMAGE_SIDES_DESKTOP_MARGIN = 15;
const IMAGE_SIDES_MOBILE_MARGIN = 5;


function MainImage() {
    const [imageProperties, setImageProperties] = useState<ImagePropertiesState>({
        width:MAX_IMAGE_WIDTH,
        height:MAX_IMAGE_HEIGHT
    });
    const [getOwnersTrigger, getOwnersResult] = useLazyGetOwnersQuery({});
    const [minted, setMinted] = useState<number>(0);

    const onResizeHandler = () =>{
        const size = calculateImageSize()
        setImageProperties(size);
    }

    useEffect(() => {
        window.addEventListener('resize', onResizeHandler, false);
        onResizeHandler();
        return () => {
            window.removeEventListener('resize', onResizeHandler);
        }
    }, []);

    useEffect(() => {
        if (isFulfilled(getOwnersResult)) {
            const owners = NSStore.getAssetOwners();
            const size = owners?owners.size:0;
            setMinted(size)
        } else if (isUninitialized(getOwnersResult)) {
            getOwnersTrigger('');
        }

    }, [getOwnersResult, getOwnersTrigger, NSStore]);

    const dispatch = useAppDispatch();

    const onUploadClick = () => {
        dispatch(showDialog(DIALOG_TYPE_IMAGE_UPLOAD));
    }

    const onMintClick = () => {
        dispatch(showDialog(DIALOG_TYPE_MINT));
    }

    const onViewFullSizeCanvasClick = () => {
        dispatch(showDialog(DIALOG_TYPE_FULL_SIZE_CANVAS));
    }

    const items = [
        {
            label:'Mint',
            text:'Mint a FantomPixels NFT to own a Random Square of 64x64 Pixels on the Canvas',
            onClick: onMintClick,
            disabled:false
        },{
            label:'Upload Image',
            text:'Upload a Square Image, a Title and a Custom URL',
            onClick: onUploadClick,
            disabled:false
        },{
            label:'You are on the Canvas',
            text:'Your Image is Rendered on the Square of Pixels with the Title and Custom URL appearing when anyone hovers over it',
            onClick:()=>{},
            disabled:true
        }
    ];

    return (
        <Row id={SECTION_ID_MAIN_IMAGE} className={'main-image section-content'}>
            <Col>
                <Row>
                    <Col className={'d-flex justify-content-center'} style={{width:`${imageProperties.width}px`, height:`${imageProperties.height}px`}}>
                        <Grid width={imageProperties.width} height={imageProperties.height}/>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}


const calculateImageSize = () => {
    const windowWidth = window.innerWidth;
    let width = windowWidth;
    if (windowWidth > 576) {
        width = windowWidth - IMAGE_SIDES_DESKTOP_MARGIN * 2;
    } else {
        width = windowWidth - IMAGE_SIDES_MOBILE_MARGIN * 2;
    }
    if (width < MAX_IMAGE_WIDTH) {
        return {
            width:width,
            height:width};
    }
    return {
        width:MAX_IMAGE_WIDTH,
        height:MAX_IMAGE_HEIGHT};
}

export default MainImage;