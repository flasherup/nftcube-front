import React from 'react';
import {Button, Col, Nav, Row} from "react-bootstrap";
import './css/MobileMenu.css'
import SocialNetworks from "../../common/SocialNetworks";
import Fantom from "../../common/fantom/Fantom";
import {useAppDispatch} from "../../../store/Hooks";
import {hideDialog, showDialog} from "../../../store/dialogs/DialogsSlice";
import {
    DIALOG_TYPE_IMAGE_UPLOAD,
    DIALOG_TYPE_MINT,
    SECTION_ID_ABOUT_US, SECTION_ID_FAQ,
    SECTION_ID_MAIN_IMAGE, SECTION_ID_PARTNERS, SECTION_ID_ROADMAP
} from "../../../constants";
import {NavHashLink} from "react-router-hash-link";
import Metamask from "../../header/metamask/Metamask";

function MobileMenu() {
    const dispatch = useAppDispatch();

    const onUploadClick = () => {
        dispatch(showDialog(DIALOG_TYPE_IMAGE_UPLOAD));
    }

    const onMintClick = () => {
        dispatch(showDialog(DIALOG_TYPE_MINT));
    }

    const onNavClick = () =>{
        dispatch(hideDialog());
    }

    return (
        <Row className={'mobile-menu h-100'}>
            <Row className={'h-75'}>
                <Col >
                    <Row className={'mobile-menu-nav'}>
                        <Col className={'d-flex justify-content-center align-items-center'}>
                            <Nav
                                defaultActiveKey={`/#${SECTION_ID_MAIN_IMAGE}`}
                                onClick={onNavClick}
                            >
                                <Nav.Item>
                                    <Nav.Link
                                        as={NavHashLink}
                                        smooth={false}
                                        eventKey={`/#${SECTION_ID_ABOUT_US}`}
                                        to={`/#${SECTION_ID_ABOUT_US}`}
                                    >ABOUT US</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link
                                        as={NavHashLink}
                                        smooth={false}
                                        eventKey={`/#${SECTION_ID_ROADMAP}`}
                                        to={`/#${SECTION_ID_ROADMAP}`}
                                    >ROADMAP</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link
                                        as={NavHashLink}
                                        smooth={false}
                                        eventKey={`/#${SECTION_ID_FAQ}`}
                                        to={`/#${SECTION_ID_FAQ}`}
                                    >F.A.Q</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link
                                        as={NavHashLink}
                                        smooth={false}
                                        eventKey={`/#${SECTION_ID_PARTNERS}`}
                                        to={`/#${SECTION_ID_PARTNERS}`}
                                    >PARTNERS</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                    </Row>
                    <Row className={'mobile-menu-upload-image'}>
                        <Col className={'d-flex justify-content-center align-items-center'}>
                            <Button onClick={()=>onUploadClick()} >UPLOAD IMAGE</Button>
                        </Col>
                    </Row>
                    <Row className={'mobile-menu-mint'}>
                        <Col className={'d-flex justify-content-center align-items-center'}>
                            <Button onClick={()=>onMintClick()}>MINT</Button>
                        </Col>
                    </Row>
                    <Row className={'mobile-menu-metamask'}>
                        <Col className={'d-flex justify-content-center align-items-center'}>
                            <Metamask />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className={'h-25'}>
                <Col>
                    <Row>
                        <Col className={'d-flex justify-content-center align-items-center'}>
                            <SocialNetworks/>
                        </Col>
                    </Row>
                    <Row>
                        <Col className={'d-flex justify-content-center align-items-center'}>
                            <Fantom />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Row>
    );
}

export default MobileMenu;