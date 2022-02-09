import React from 'react';
import {Col, Row} from "react-bootstrap";
import Grid from "../../common/grid/Grid";
import './css/FullSizeCanvas.css'

const MAX_IMAGE_WIDTH = 1024;
const MAX_IMAGE_HEIGHT = 1024;

function FullSizeCanvas() {
    return(
        <Row>
            <Col className={'full-size-canvas d-flex justify-content-center'}>
                <Grid width={MAX_IMAGE_WIDTH} height={MAX_IMAGE_HEIGHT}/>
            </Col>
        </Row>
    );
}

export default FullSizeCanvas;