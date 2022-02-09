import React from 'react';
import {Button, Col, Row} from "react-bootstrap";

interface CompleteStateProps {
    onOkClick:()=>void
    message?: string
}

function CompleteState(props:CompleteStateProps) {
    return (
        <Row className={'h-100'}>
            <Col>
                <Row className={'h-50'}>
                    <Col className={'d-flex justify-content-center align-items-end'}>
                        {props.message}
                    </Col>
                </Row>
                <Row className={'h-50'}>
                    <Col className={'d-flex justify-content-center align-items-center'}>
                        <Button
                            onClick={props.onOkClick}
                            className={'fantom-button'}
                        >OK</Button>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default CompleteState;