import React, {useState} from 'react';
import {ImageProps} from 'react-bootstrap';
import './css/ImageUI.css';

interface ImageUIProps extends  ImageProps{
    srcOver:string
}

interface ImageUIState {
    isOver:boolean
    idleClass:string
    overClass:string
}

const CLASS_HIDDEN = 'image-ui-hidden'

function ImageUI(props: ImageUIProps) {
    const [state, setState] = useState<ImageUIState>({
        isOver:false,
        idleClass:'',
        overClass:CLASS_HIDDEN
    })

    const onOver = (event:any) => {
        if (props.onMouseOver) props.onMouseOver(event);
        setState({
            isOver:true,
            idleClass:CLASS_HIDDEN,
            overClass:''
        });
    }

    const onOut = (event:any) => {
        if (props.onMouseOut) props.onMouseOut(event);
        setState({
            isOver:false,
            idleClass:'',
            overClass:CLASS_HIDDEN
        });
    }

    const onClick = (event:any) => {
        if (props.onClick) props.onClick(event);
    }

    //const imageClass = state.isOver?'image-ui-hidden':'';
    //const imageOverClass = !state.isOver?'image-ui-hidden':'';

    return (
        <div
            onMouseOver={onOver}
            onMouseOut={onOut}
            onClick={onClick}
            className={'image-ui'}>
            <img className={state.idleClass} src={props.src}/>
            <img className={state.overClass} src={props.srcOver}/>
        </div>
    );
}

export default ImageUI;