import React from 'react';
import {Col, Row} from "react-bootstrap";

import MainImage from "./sections/mainImage/MainImage";

import './common/css/Section.css'

function Body() {
    return (
        <Row>
            <Col>
                <Row className={'section'}>
                    <Col className={'d-flex justify-content-center'}>
                        <MainImage/>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default Body;