import React from 'react';
import {Col, Container, Row, Image} from "react-bootstrap";

import './css/dialog.css'
import {useAppDispatch, useAppSelector} from "../../store/Hooks";
import {hideDialog} from '../../store/dialogs/DialogsSlice';

import {RootState} from "../../store/MainStore";
import CloseBtn from '../../images/CloseBtn.svg'
import {
    DIALOG_TYPE_FULL_SIZE_CANVAS,
    DIALOG_TYPE_IMAGE_UPLOAD, DIALOG_TYPE_IMAGE_UPLOAD_TEST, DIALOG_TYPE_LINK_WARNING,
    DIALOG_TYPE_MAIN_ERROR,
    DIALOG_TYPE_METAMASK_CONNECTION,
    DIALOG_TYPE_METAMASK_ERROR,
    DIALOG_TYPE_METAMASK_SIGN,
    DIALOG_TYPE_METAMASK_VALIDATE_CONNECTION,
    DIALOG_TYPE_METAMASK_VALIDATE_SIGN,
    DIALOG_TYPE_MINT,
    DIALOG_TYPE_MOBILE_MENU,
    DIALOG_TYPE_ON_THE_CANVAS
} from "../../constants";

import ImageUpload from "./imageUpload/ImageUpload";
import MobileMenu from "./mobileMenu/MobileMenu";
import ComingSoon from './comingSoon/ComingSoon';
import ImageUploadSubmit from "./imageUpload/ImageUploadSubmit";
import Mint from "./mint/Mint";
import FullSizeCanvas from "./fullSizeCanvas/FullSizeCanvas";
import LinkWarning from "./linkWarning/LinkWarning";

function Dialog() {
    const dispatch = useAppDispatch();
    const dialogType  = useAppSelector((state: RootState) => state.dialogs.type);
    const mainError  = useAppSelector((state: RootState) => state.dialogs.mainError);

    return (
        <Container
            fluid={ true }
            className={`modal d-flex justify-content-center align-items-center`}
        >
            <Row className={'modal-container'}>
                <Col>
                    <Row className={'modal-title-row'}>
                        <Col  className={`modal-title  d-flex justify-content-start d-flex align-items-center`}>
                            { getTitle(dialogType) }
                        </Col>
                        <Col md={1} xs={3}  className={'modal-close-button-container d-flex justify-content-end align-items-center'}>
                            { getCloseButton(dialogType) }
                        </Col>
                    </Row>
                    <Row className={'modal-content-row'}>
                        <Col>{ getSate(dialogType) }</Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );

    function getCloseButton(type:string) {
        return (
            <Image
                className={'modal-close-button'}
                onClick={()=>close()}
                src={CloseBtn}
            />
        );
    }

    function getSate(type:string) {
        switch (type) {
            case DIALOG_TYPE_MAIN_ERROR:
                const error = mainError?mainError.message:'Error';
                return <div>{error}</div>
            case DIALOG_TYPE_METAMASK_CONNECTION:
                return <div>Connecting...</div>
            case DIALOG_TYPE_METAMASK_VALIDATE_CONNECTION:
                return <div>Validation connection...</div>
            case DIALOG_TYPE_METAMASK_SIGN:
                return <div>Signing...</div>
            case DIALOG_TYPE_METAMASK_VALIDATE_SIGN:
                return <div>Validation Sign...</div>
            case DIALOG_TYPE_METAMASK_ERROR:
                return <div>Error</div>
            case DIALOG_TYPE_IMAGE_UPLOAD:
                return <ImageUpload />
            case DIALOG_TYPE_IMAGE_UPLOAD_TEST:
                return <ImageUploadSubmit />
            case DIALOG_TYPE_MINT:
                return <Mint/>
            case DIALOG_TYPE_ON_THE_CANVAS:
                return <ComingSoon />
            case DIALOG_TYPE_MOBILE_MENU:
                return <MobileMenu/>
            case DIALOG_TYPE_FULL_SIZE_CANVAS:
                return <FullSizeCanvas/>
            case DIALOG_TYPE_LINK_WARNING:
                return <LinkWarning/>
        }
        return <div>Modal content</div>
    }

    function getTitle(type:string) {
        switch (type) {
            case DIALOG_TYPE_MAIN_ERROR:
                return mainError?mainError.title:'Error';
            case DIALOG_TYPE_METAMASK_CONNECTION:
            case DIALOG_TYPE_METAMASK_VALIDATE_CONNECTION:
            case DIALOG_TYPE_METAMASK_SIGN:
            case DIALOG_TYPE_METAMASK_VALIDATE_SIGN:
                return 'Metamask'
            case DIALOG_TYPE_METAMASK_ERROR:
                return 'Metamask Error'
            case DIALOG_TYPE_IMAGE_UPLOAD:
                return 'EDIT IMAGE'
            case DIALOG_TYPE_IMAGE_UPLOAD_TEST:
                return 'UPLOAD IMAGE SUBMIT'
            case DIALOG_TYPE_MINT:
                return 'MINT'
            case DIALOG_TYPE_ON_THE_CANVAS:
                return 'YOU ON THE CAVAS'
            case DIALOG_TYPE_MOBILE_MENU:
                return 'FantomPixels'
            case DIALOG_TYPE_FULL_SIZE_CANVAS:
                return 'Canvas'
            case DIALOG_TYPE_LINK_WARNING:
                return 'Links can be dangerous!'
        }
        return 'Modal';
    }

    function close() {
        dispatch(hideDialog());
    }
}

export default Dialog;