import React from 'react';
import {Button, Col, Row} from "react-bootstrap";
import {NSStore} from "../../../../store/NonSerializableStore";
import {EthersMintData} from "../../../../store/ethers/EthersInterfaces";

interface CompleteStateProps {
    onOkClick:()=>void
}

function CompleteState(props:CompleteStateProps) {
    const dataMint = NSStore.getEthersData() as EthersMintData
    let message:JSX.Element | string = 'MINT SUCCESS';
    if (dataMint) {
        const link = `https://testnet.ftmscan.com/tx/${dataMint.hash}`
        message = <p>MINT SUCCESS <a href={link} target={'_blank'}>Transcation on FTMScan</a></p>
    }

    return (
        <Row className={'h-100'}>
            <Col>
                <Row className={'h-75'}>
                    <Col className={'d-flex justify-content-center align-items-center'}>
                        {message}
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

export default CompleteState;