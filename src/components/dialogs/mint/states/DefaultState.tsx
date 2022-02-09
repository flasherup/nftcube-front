import React from 'react';
import {Col, Row} from "react-bootstrap";

interface DefaultStateProps {
    message:string
}

function DefaultState(props:DefaultStateProps) {
    return (
        <Row className={'h-100'}>
            <Col className={'d-flex justify-content-center align-items-center'}>
                {props.message}
            </Col>
        </Row>

    );
}

export default DefaultState;