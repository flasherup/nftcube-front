import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import {MainStore} from './store/MainStore'
import {Provider} from 'react-redux';
import reportWebVitals from './reportWebVitals';
import LogicProvider, {Logic} from "./logic/LogicProvider";
import {BrowserRouter} from "react-router-dom";
import {MetamaskInitialisation} from "./logic/MetamaskInitialisation";
import {AssetsUpdate} from "./logic/AssetsUpdateLogic";
import {MetamaskEthersInitialisation} from "./logic/MetamaskEthersInitialisation";

const logic:Logic[] = [
    AssetsUpdate,
]

ReactDOM.render(
    <Provider store={MainStore}>
        <BrowserRouter>
            <LogicProvider logic={logic}>
                <App/>
            </LogicProvider>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

