import React, {useState} from 'react';
import {Col, Row, Image, Button} from "react-bootstrap";
import './css/MainImageItem.css';

interface MainImageItemProps {
    label:string
    text: string
    onClick: ()=>void
    disabled:boolean
}

function MainImageItem(props: MainImageItemProps) {
    return (
            <Col md={4} xs={12} className={'main-image-item'}>
                <Row>
                    <Col className={'d-flex justify-content-center'}>
                        <Button disabled={props.disabled} className={'fantom-button main-image-item-btn d-flex justify-content-center align-items-center'} onClick={props.onClick}>
                            {props.label}
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col className={'d-flex justify-content-center'}>
                        <p>{props.text}</p>
                    </Col>
                </Row>
            </Col>
    );
}

export default MainImageItem;