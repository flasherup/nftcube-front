import React from 'react';
import {Col, Row, Image} from "react-bootstrap";
import './css/Fantom.css'
import FantomLogo from '../../../images/FantomLogo.svg';
function Fantom() {
    return (
        <Row onClick={()=>openURL('https://fantom.foundation')} className={'fantom'}>
            <Col className={'fantom-image d-flex justify-content-start align-items-center'}>
                <Image src={FantomLogo} />
            </Col>
            <Col className={'fantom-label d-flex justify-content-start align-items-center'}>
                <p>Powered by Fantom blockchain</p>
            </Col>
        </Row>
    );
}
export default Fantom;

const openURL = (url: string) => {
    window.open(url);
}