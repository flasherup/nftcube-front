import React from 'react';
import {Col, Nav, Row} from "react-bootstrap";
import {HashLink} from 'react-router-hash-link';
import './css/Menu.css'
import {
    SECTION_ID_ABOUT_US,
} from "../../../constants";

function Menu() {
    return (
        <Row className={'menu'}>
            <Col>
                <Nav>
                    <Nav.Item>
                        <Nav.Link
                            as={HashLink}
                            smooth
                            eventKey={`/#${SECTION_ID_ABOUT_US}`}
                            to={`/#${SECTION_ID_ABOUT_US}`}
                        >ABOUT US</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Col>
        </Row>
    );
}

export default Menu;