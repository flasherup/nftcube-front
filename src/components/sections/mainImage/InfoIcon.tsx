import React from 'react';
import {Button, Col, Container, OverlayTrigger, Popover, Row} from 'react-bootstrap';
import './css/InfoIcon.css'

function InfoIcon() {
    const popover = (
        <Popover id='popover-basic'>
            <Popover.Body>
                { getInfoContent() }
            </Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger
            placement='left'
            overlay={ popover }
        >
            <Button className={'fantom-button info-icon'}><p>i</p></Button>
        </OverlayTrigger>
    );
}

export default InfoIcon;

const getInfoContent = () => {
    return (
        <Container className={'info-icon-content'}>
            <Row>
                <Col>
                    <p>After you mint a FantomPixels NFT, you receive a random NFT that corresponds to one unique 64 x 64 square of pixels on the canvas.</p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>You can upload a square Image, give it a Title and set a URL that gets reflected on the canvas for the entire world to see. After Phase 2, you can change the Image, Title and URL indefinitely.</p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>After Phase 3, your FantomPixels NFTs can be resold on Secondary Markets.</p>
                </Col>
            </Row>
        </Container>
    )
}