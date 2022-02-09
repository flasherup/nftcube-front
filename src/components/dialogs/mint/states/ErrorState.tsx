import React from 'react';
import {Button, Col, Row} from "react-bootstrap";

interface ErrorStateProps {
    error: string | null
    onOkClick:()=>void
}

function ErrorState(props:ErrorStateProps) {
    return (
        <Row className={'h-100'}>
            <Col>
                <Row className={'h-75'}>
                    <Col className={'d-flex justify-content-center align-items-center'}>
                        {props.error}
                    </Col>
                </Row>
                <Row className={'h-25'}>
                    <Col className={'d-flex justify-content-center align-items-start'}>
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

export default ErrorState;