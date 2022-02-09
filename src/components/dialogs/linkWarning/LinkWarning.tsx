import React, {useEffect} from 'react';
import {Col, Row} from "react-bootstrap";
import {useAppSelector} from "../../../store/Hooks";
import {RootState} from "../../../store/MainStore";
import {NSStore} from "../../../store/NonSerializableStore";
import './css/LinkWarning.css'

function LinkWarning() {
    const {navigateToken} = useAppSelector((state: RootState) => state.fantomPixels);
    const [link, setLink] = React.useState<string>('');

    useEffect(() => {
        const attributes = NSStore.getAssetAttribute();
        if (attributes) {
            const a  = attributes.get(navigateToken);
            if (a) {
                setLink(a.url as string);
            }
        }
    }, [navigateToken, setLink]);

    return (
        <Row className={'link-warn'}>
            <Col>
                <Row className={'h-50'}>
                    <Col className={'d-flex justify-content-center align-items-end'}>
                        Make sure you know where you are going:
                    </Col>
                </Row>
                <Row className={'h-50'}>
                    <Col className={'d-flex justify-content-center align-items-center'}>
                        <a href={link} target={'_blank'}>{link}</a>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default LinkWarning;