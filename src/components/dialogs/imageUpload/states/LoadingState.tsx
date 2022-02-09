import React from 'react';
import {Button, Col, Row} from "react-bootstrap";
import './../../../common/css/BouncePreloader.css';

interface LoadingStateProps {
    message?:string
}

function LoadingState(props: LoadingStateProps) {
    let message = 'Uploading....'
    if (props.message) message = props.message;

    return (
        <Row className={'h-100'}>
            <Col>
                <Row className={'h-50'}>
                    <Col className={'d-flex justify-content-center align-items-end'}>
                        <div className="bounceball"/>
                    </Col>
                </Row>
                <Row className={'h-50'}>
                    <Col className={'d-flex justify-content-center align-items-center'}>
                        {message}
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default LoadingState;