import React from 'react';
import {Button, Col, Row} from "react-bootstrap";
import {showDialog} from "../../../store/dialogs/DialogsSlice";
import {DIALOG_TYPE_IMAGE_UPLOAD} from "../../../constants";
import {useAppDispatch} from "../../../store/Hooks";

function Upload() {
    const dispatch = useAppDispatch();
    const onUploadClick = () =>{
        dispatch(showDialog(DIALOG_TYPE_IMAGE_UPLOAD));
    }
    return (
        <Row>
            <Col>
                <Button onClick={onUploadClick}>UPLOAD YOUR IMAGE</Button>
            </Col>
        </Row>
    );
}

export default Upload;