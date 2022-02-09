import React, {useCallback, useState} from 'react';
import {Button, Col, Form, Row} from "react-bootstrap";

interface SelectorStateProps {
    onMint:(count:number)=>void
}

const MIN = 1;
const MAX = 5;

function SelectorState(props:SelectorStateProps) {
    const [mintNumber, setMintNumber] = useState<number>(1);

    const onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        let index = parseInt(event.target.value);
        index = normalizeCount(index);
        setMintNumber(index)
    }

    const onMintClick = useCallback(() => {
        props.onMint(mintNumber);
    }, [props, mintNumber]);

    return (
        <Row className={'h-100'}>
            <Col>
                <Row className={'h-50'}>
                    <Col className={'d-flex justify-content-center align-items-center'}>
                        NUMBER TO MINT
                    </Col>
                </Row>
                <Row className={'h-50'}>
                    <Form className={'w-100'}>
                        <Row>
                            <Col className={'about-us-item-text d-flex align-items-center justify-content-start'}>
                                <Form.Control onChange={onChange} value={mintNumber} type={'number'} min="1" max="5"/>
                            </Col>
                            <Col className={'about-us-item-text d-flex align-items-center justify-content-start'}>
                                <Button
                                    onClick={onMintClick}
                                    className={'fantom-button'}
                                >MINT</Button>
                            </Col>
                        </Row>
                    </Form>
                </Row>
            </Col>
        </Row>

    );
}

function normalizeCount(count:number):number {
    if (count < MIN) return MIN;
    if (count > MAX) return MAX;
    return count;
}

export default SelectorState;