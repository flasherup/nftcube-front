import React from 'react';
import './css/Tooltip.css';
import {Button} from 'react-bootstrap';
import {trimIfNeeded} from "../../../utils/strings";

const TRIM_SIZE = 32;

export interface TooltipProps {
    token:string
    name: string
    url: string
    x:number
    y:number
    visible:boolean
    orientationX:string
    orientationY:string
    onMouseOver:(props:TooltipProps)=>void
    onMouseOut:(props:TooltipProps)=>void
    onClick:(props:TooltipProps)=>void
}

export const ORIENTATION_START = 'start';
export const ORIENTATION_CENTER = 'orientationCenter';
export const ORIENTATION_END = 'orientationCenter';

function Tooltip(props: TooltipProps) {
    const visibility = props.visible?'visible':'hidden';
    const opacity = props.visible?'1':'0';

    let translateX = '-50%';
    if (props.orientationX === ORIENTATION_START) {
        translateX = '0%';
    } else if (props.orientationX === ORIENTATION_END) {
        translateX = '-100%';
    }

    let translateY = '-50%';
    if (props.orientationY === ORIENTATION_START) {
        translateY = '0%';
    } else if (props.orientationY === ORIENTATION_END) {
        translateY = '-100%';
    }

    return (
        <Button className={'fantom-button img-tooltip'} onMouseOver={()=>props.onMouseOver(props)} onMouseOut={()=>props.onMouseOut(props)} onClick={()=>props.onClick(props)} style={{
            left:`${props.x}px`,
            top:`${props.y}px`,
            transform: `translate(${translateX}, ${translateY})`,
            visibility,
            opacity,
        }}>
            <p>#{props.token}</p>
            <p>{trimIfNeeded(props.name, TRIM_SIZE)}</p>
            <p>{trimIfNeeded(props.url, TRIM_SIZE)}</p>
        </Button>
    );
}

export default Tooltip;