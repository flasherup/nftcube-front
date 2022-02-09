export interface CellEvent {
    type:string
    index:number
    x:number
    y:number
    width:number
    height:number
    absoluteX:number
    absoluteY:number
}

type CellCallback = (event:CellEvent)=>void;

export const EVENT_TYPE_CELL_IN    = 'cellIn';
export const EVENT_TYPE_CELL_OUT   = 'cellOut';
export const EVENT_TYPE_CELL_CLICK   = 'cellClick';

export default class MouseHandler {
    protected src:HTMLImageElement | null;
    protected cols:number;
    protected rows:number;
    protected width:number = 0;
    protected height:number = 0;
    protected x:number = 0;
    protected y:number = 0;
    protected cellWidth:number = 0;
    protected cellHeight:number = 0;
    protected cellOver:number = -1;
    protected eventsMap:Map<string,CellCallback> = new Map();
    constructor(src:HTMLImageElement | null, cols:number, rows:number) {
        this.cols = cols;
        this.rows = rows;
        this.src = src;
        this.onResize();
        src?.addEventListener('mousemove', (event)=>this.onMouseMove(event))
        src?.addEventListener('mouseout', (event)=>this.onMouseOut(event))
        src?.addEventListener('click', (event)=>this.onMouseClick(event))
    }

    addEvent(type:string, callback:CellCallback) {
        this.eventsMap.set(type, callback);
    }

    removeEvent(type:string) {
        this.eventsMap.delete(type);
    }

    onResize() {
        const {src, cols, rows} = this;
        this.width = src?src.width:cols;
        this.height = src?src.clientHeight:rows;
        this.x = src?src.offsetLeft:0;
        this.y = src?src.offsetTop:0;
        this.cellWidth = this.width/cols;
        this.cellHeight = this.height/rows;
    }

    onMouseMove(event:MouseEvent) {
        const {cellWidth, cellHeight, cellOver, cols, eventsMap} = this;
        const x = event.offsetX;
        const y = event.offsetY;

        const px = Math.floor(x/cellWidth);
        const py = Math.floor(y/cellHeight);
        const index = px + py * cols;
        if (cellOver !== index) {
            if (cellOver !== -1 && eventsMap.has(EVENT_TYPE_CELL_OUT)) {
                const callback = eventsMap.get(EVENT_TYPE_CELL_OUT);
                if (callback)callback({
                    type:EVENT_TYPE_CELL_OUT,
                    index:cellOver,
                    x:px*cellWidth,
                    y:py*cellHeight,
                    width:cellWidth,
                    height:cellHeight,
                    absoluteX:this.x,
                    absoluteY:this.y,
                });
            }

            if (eventsMap.has(EVENT_TYPE_CELL_IN)) {
                const callback = eventsMap.get(EVENT_TYPE_CELL_IN);
                if (callback)callback({
                    type:EVENT_TYPE_CELL_IN,
                    index,
                    x:px*cellWidth,
                    y:py*cellHeight,
                    width:cellWidth,
                    height:cellHeight,
                    absoluteX:this.x,
                    absoluteY:this.y,
                });
            }
            this.cellOver = index;
        }
    }

    onMouseOut(event:MouseEvent) {
        const {cellWidth, cellHeight, cellOver, eventsMap} = this;
        const x = event.offsetX;
        const y = event.offsetY;
        if (eventsMap.has(EVENT_TYPE_CELL_OUT)) {
            const callback = eventsMap.get(EVENT_TYPE_CELL_OUT);
            if (callback)callback({
                type:EVENT_TYPE_CELL_OUT,
                index:cellOver,
                x,
                y,
                width:cellWidth,
                height:cellHeight,
                absoluteX:this.x,
                absoluteY:this.y,
            });
        }
        this.cellOver = -1;
    }

    onMouseClick(event:MouseEvent) {
        const {cellWidth, cellHeight, cellOver, eventsMap} = this;
        const x = event.offsetX;
        const y = event.offsetY;
        if (eventsMap.has(EVENT_TYPE_CELL_CLICK)) {
            const callback = eventsMap.get(EVENT_TYPE_CELL_CLICK);
            if (callback)callback({
                type:EVENT_TYPE_CELL_CLICK,
                index:cellOver,
                x,
                y,
                width:cellWidth,
                height:cellHeight,
                absoluteX:this.x,
                absoluteY:this.y,
            });
        }
    }

    dispose() {
        this.eventsMap.clear();
    }
}