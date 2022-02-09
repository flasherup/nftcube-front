import React from 'react';
import {Col, Image, Row} from "react-bootstrap";
import './css/Footer.css'
import logo from "../../images/Logo.svg";

function Footer() {
    return (
        <Row className={'footer'}>
            <Col>
                <Row>
                    <Col lg={4} md={5} className={'footer-logo d-flex justify-content-start align-items-center'}>
                        <Image src={logo}/><h1>NFTCUBE</h1>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default Footer;