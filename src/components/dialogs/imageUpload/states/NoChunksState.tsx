import React, {useCallback} from 'react';
import {Button, Col, Row} from "react-bootstrap";
import {ETHERS_METHOD_MINT, ethersRequest} from "../../../../store/ethers/EthersSlice";
import {showDialog} from "../../../../store/dialogs/DialogsSlice";
import {DIALOG_TYPE_MINT} from "../../../../constants";
import {useAppDispatch} from "../../../../store/Hooks";

function NotChunksState() {
    const dispatch = useAppDispatch();

    const onMintClick = useCallback(() => {
        dispatch(showDialog(DIALOG_TYPE_MINT));
    }, [dispatch]);

    return (
        <Row className={'h-100'}>
            <Col>
                <Row className={'h-75'}>
                    <Col className={'d-flex justify-content-center align-items-center'}>
                        YOU DON'T HAVE ANY CHUNKS YET
                    </Col>
                </Row>
                <Row className={'h-25'}>
                    <Col className={'d-flex justify-content-center align-items-start'}>
                        <Button onClick={onMintClick} className={'fantom-button d-flex justify-content-start align-items-center'}>
                            MINT
                        </Button>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default NotChunksState;