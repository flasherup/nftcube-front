import React from 'react';
import {Button, Col, Image, Row} from "react-bootstrap";
import Menu from './menu/Menu';
import Metamask from "./metamask/Metamask";
import './css/Header.css';
import BurgerBtn from "../../images/BurgerBtn.svg";
import logo from "../../images/Logo.svg";
import {useAppDispatch} from "../../store/Hooks";
import {showDialog} from "../../store/dialogs/DialogsSlice";
import {DIALOG_TYPE_IMAGE_UPLOAD, DIALOG_TYPE_MINT, DIALOG_TYPE_MOBILE_MENU} from "../../constants";
function Header() {
    const dispatch = useAppDispatch();

    const openMobileMenu = () => {
        dispatch(showDialog(DIALOG_TYPE_MOBILE_MENU));
    }


    const onUploadClick = () => {
        dispatch(showDialog(DIALOG_TYPE_IMAGE_UPLOAD));
    }

    const onMintClick = () => {
        dispatch(showDialog(DIALOG_TYPE_MINT));
    }


    return (
        <Row className={'header'}>
            <Col xs={6} className={'header-logo d-flex justify-content-start align-items-center'}>
                <Image src={logo}/><h1>NFTCUBE</h1>
            </Col>
            <Col xs={6} className={'header-buttons d-none d-sm-flex justify-content-xl-end justify-content-md-center justify-content-sm-start'}>
                <Metamask />
            </Col>
        </Row>
    );
}

export default Header;