import React from 'react';
import {Button, Col, Row} from "react-bootstrap";
import Metamask from "../../../header/metamask/Metamask";

function NotConnectedState() {
    return (
        <Row className={'h-100'}>
            <Col>
                <Row className={'h-75'}>
                    <Col className={'d-flex justify-content-center align-items-center'}>
                        YOU ARE NOT CONNECTED TO METAMASK
                    </Col>
                </Row>
                <Row className={'h-25'}>
                    <Col className={'d-flex justify-content-center align-items-start'}>
                        <Metamask/>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default NotConnectedState;