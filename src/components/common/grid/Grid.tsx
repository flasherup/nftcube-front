import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Col, Row, Image} from 'react-bootstrap';
import {
    useLazyGetAttributesQuery,
    useLazyGetMainImageQuery
} from '../../../store/backend/AssetsAPI';
import MouseHandler, {
    CellEvent,
    EVENT_TYPE_CELL_IN,
    EVENT_TYPE_CELL_OUT
} from './utils/MouseHandler';
import HighlighterD3 from './d3/HighlighterD3';
import './css/Grid.css'
import Tooltip, {ORIENTATION_CENTER, ORIENTATION_END, ORIENTATION_START, TooltipProps} from './Tooltip';
import {AssetAttribute, NSStore} from "../../../store/NonSerializableStore";
import {useAppDispatch} from "../../../store/Hooks";
import { showDialog } from '../../../store/dialogs/DialogsSlice';
import {CHUNKS_IN_CELL, CHUNKS_IN_ROW, DIALOG_TYPE_LINK_WARNING} from "../../../constants";
import { setNavigateToken } from '../../../store/backend/FantomPixelsSlice';


interface ImageSrcState {
    imageSrc:string
}

interface GridProps {
    width:number
    height:number
}

const NOT_SET_VALUE = 'NOT SET'

function Grid(props:GridProps) {
    const imgRef = useRef<HTMLImageElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const tooltipDelayId = useRef<ReturnType<typeof setTimeout>>();
    const tooltipHideDelayId = useRef<ReturnType<typeof setTimeout>>();
    //const {data} = useGetMainImageQuery('');
    const [getMainImageTrigger, mainImageData] = useLazyGetMainImageQuery({});
    const [getAttributesTrigger, getAttributesResult] = useLazyGetAttributesQuery({});
    const [src, setSrc] = useState<ImageSrcState>({imageSrc:''});
    const graph = useRef<HighlighterD3>();
    const mouseHandler = useRef<MouseHandler>();
    const dispatch = useAppDispatch();

    useEffect(()=>{
        return ()=>{
            graph.current?.dispose();
        }
    },[]);

    useEffect(() => {
        if (!getAttributesResult.data) {
            getAttributesTrigger('');
        }
    }, [getAttributesResult, getAttributesTrigger]);

    const onTooltipOver = useCallback((props:TooltipProps) => {
        if(tooltipHideDelayId.current) {
            clearTimeout(tooltipHideDelayId.current);
        }
    },[tooltipHideDelayId]);

    const onTooltipOut = useCallback((props:TooltipProps) => {
        tooltipHideDelayId.current = setTimeout(()=>{
            setTooltipProps({
                ...tooltipProps,
                visible:false
            })
        }, 500);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[tooltipHideDelayId]);

    const onTooltipClick = useCallback((props:TooltipProps) => {
        if (props.url !== NOT_SET_VALUE) {
            setTooltipProps({
                ...tooltipProps,
                visible:false
            })
            dispatch(setNavigateToken(props.token))
            dispatch(showDialog(DIALOG_TYPE_LINK_WARNING))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[dispatch]);

    const [tooltipProps, setTooltipProps] = useState<TooltipProps>({
        token: '-1',
        visible:false,
        x:100,
        y:100,
        name: NOT_SET_VALUE,
        url: NOT_SET_VALUE,
        orientationX:ORIENTATION_CENTER,
        orientationY:ORIENTATION_START,
        onMouseOver:onTooltipOver,
        onMouseOut:onTooltipOut,
        onClick:onTooltipClick,
    });

    useEffect(() => {
        if (!graph.current) {
            graph.current = new HighlighterD3(svgRef.current, CHUNKS_IN_CELL, CHUNKS_IN_ROW);
            graph.current.initialize();
        }
        graph.current.updateProportions(props.width, props.height)
    }, [svgRef, props.width, props.height]);

    const onCellIn = useCallback((event:CellEvent) => {
        graph.current?.showCell(event.index);
        if (tooltipDelayId.current)clearTimeout(tooltipDelayId.current);
        if (tooltipHideDelayId.current)clearTimeout(tooltipHideDelayId.current);
        tooltipDelayId.current = setTimeout(()=> {
            let {name, url} = getAttributes(event.index, NSStore.getAssetAttribute());
            let orientationX = ORIENTATION_CENTER;
            let orientationY = ORIENTATION_END;
            let x = event.x + event.absoluteX + event.width/2;
            let y = event.y + event.absoluteY;

            const img = imgRef.current;
            if (img) {
                if (img.clientWidth/2 <= event.x) {
                    orientationX = ORIENTATION_END
                    x = event.x + event.absoluteX ;
                } else if (img.clientWidth/2 > event.x) {
                    orientationX = ORIENTATION_START
                    x = event.x + event.absoluteX + event.width;
                }

                if (img.clientHeight/2 <= event.y) {
                    orientationY = ORIENTATION_END;
                    y = event.y + event.absoluteY + event.height;
                } else if (img.clientHeight/2 > event.y) {
                    orientationY = ORIENTATION_START;
                    y = event.y + event.absoluteY;
                }
            }

            const token = event.index + 1;
            setTooltipProps({
                ...tooltipProps,
                token: token.toString(),
                visible:true,
                x,
                y,
                name,
                url,
                orientationX,
                orientationY,
            })
        },500);
    }, [graph, imgRef, tooltipProps])

    const onCellOut = useCallback((event:CellEvent) => {
        graph.current?.hideCell(event.index);
        if (tooltipDelayId.current)clearTimeout(tooltipDelayId.current);
        tooltipHideDelayId.current = setTimeout(()=>{
            setTooltipProps({
                ...tooltipProps,
                visible:false
            })
        }, 500);

    }, [graph, tooltipProps])

    useEffect(() => {
        if (mainImageData.data) {
            setSrc({imageSrc:mainImageData.data as string})
        } else {
            getMainImageTrigger('');
        }
    }, [getMainImageTrigger, mainImageData]);


    useEffect(() => {
        if (!mouseHandler.current) {
            mouseHandler.current = new MouseHandler(imgRef.current, CHUNKS_IN_CELL, CHUNKS_IN_ROW);
        }
        mouseHandler.current.addEvent(EVENT_TYPE_CELL_IN, onCellIn);
        mouseHandler.current.addEvent(EVENT_TYPE_CELL_OUT, onCellOut);
        mouseHandler.current?.onResize();
        return ()=>{
            mouseHandler.current?.dispose();
        }
    }, [onCellIn, onCellOut, graph, imgRef, tooltipProps, props.width, props.height]);

    const visible  = !mainImageData.data?'hidden':'visible';

    return (
        <Row className={'grid'}>
            <Col className={'d-flex justify-content-center'} style={{width:`${props.width}px`, height:`${props.height}px`}}>
                <Image className={'grid-image'} ref={imgRef} style={{width:`${props.width}px`, height:`${props.height}px`, visibility:`${visible}`}} src={src.imageSrc}/>
                <svg className={'grid-svg'} ref={svgRef} width={props.width} height={props.height}/>
                <Tooltip {...tooltipProps}/>
            </Col>
        </Row>
    );
}

const getAttributes = (index:number, attributes:Map<string, AssetAttribute> | undefined) => {
    index ++;
    let name = NOT_SET_VALUE;
    let url =NOT_SET_VALUE;
    if (attributes) {
        const attr =  attributes.get(index.toString());
        if (attr) {
            name = attr.title?attr.title:name;
            url = attr.url?attr.url:url;
        }
    }
    return {name, url};
}

export default Grid;