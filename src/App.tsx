import React, {useRef, useEffect, useState} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import Header from './components/header/Header';
import Body from './components/Body';
import Footer from './components/footer/Footer';
import Screen from './components/common/Screen';
import {useAppSelector} from "./store/Hooks";
import Dialog from './components/dialogs/Dialog';
import {RootState} from "./store/MainStore";
import './App.css'
import Background from './components/common/Background';

interface AppState {
    scrollable:HTMLDivElement | null;
}

const initialState = {scrollable:null} as AppState;

function App() {
    let backgroundRef =  useRef<HTMLDivElement>(null);
    const dialogShown = useAppSelector((state: RootState) => state.dialogs.shown);
    const [state, setSate] = useState<AppState>(initialState);
    useEffect(() => {
        if (backgroundRef) {
            setSate({scrollable:backgroundRef.current});
        }
    }, [backgroundRef]);

    return (
        <Screen className='main-screen' link={backgroundRef}
                content={getContent()}
                overlay={getOverlay(dialogShown)}
                parallax={<Background/>}
        />
    );
}

function getContent() {
    return (
        <Container fluid={true}>
            <Row>
                <Col><Header/></Col>
            </Row>
            <Row>
                <Col><Body/></Col>
            </Row>
            <Row>
                <Col><Footer/></Col>
            </Row>
        </Container>
    )
}

function getOverlay(shown: boolean): JSX.Element | null {
    if (!shown) {
        return null;
    }
    return <Dialog/>;
}

export default App;
