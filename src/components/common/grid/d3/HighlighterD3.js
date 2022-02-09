import * as d3 from 'd3';

const HIDDEN_CELL_OPACITY = 0;

export default class HighlighterD3 {
    constructor(parent, cells, rows) {
        this.parent = parent;
        this.cells = cells;
        this.rows = rows;
    }

    updateProportions(width, height) {
        const {cells, rows} = this;
        const w = width;
        const h = height;
        const cellWidth = w/cells;
        const cellHeight = h/rows;

        this.boxes
            .attr('transform', (d,i) => `translate(${xFromIndex(i,cellWidth, cells)},${yFromIndex(i,cellHeight, rows)})`)
            .attr('width', cellWidth)
            .attr('height', cellHeight)
    }

    initialize() {
        const {cells, rows} = this;
        const parent = d3.select(this.parent);
        const svg = parent.append('g');

        const data = getBoxes(cells, rows);

        let boxes = svg
            .selectAll('.box')
            .data(data);

        const newBoxes = boxes
            .enter()
            .append('rect')
            .attr('class', 'box')
            .attr('fill-opacity', 0)
            .attr('stroke', d=>d.stroke)
            .attr('strokeWidth', 1)
            .attr('opacity', HIDDEN_CELL_OPACITY);

        boxes = boxes.merge(newBoxes);

        this.boxes = boxes;
        this.svg = svg;
    }

    hideCell(index) {
        const {boxes} = this;
        boxes.each((d, i, nodes) => {
            if (i===index) {
                const node = d3.select(nodes[i]);
                node
                    .transition()
                    .duration(500)
                    .attr('opacity', HIDDEN_CELL_OPACITY);
            }
        });
    }

    showCell(index) {
        const {boxes} = this;
        boxes.each((d, i, nodes) => {
            if (i===index) {
                const node = d3.select(nodes[i]);
                node
                    .transition()
                    .delay(50)
                    .duration(100)
                    .attr('opacity', 1);
            }
        });
    }

    dispose() {
        if (this.svg) {
            this.svg.remove();
        }
    }
}

const getBoxes = (cells, rows) => {
    const length = cells * rows;
    const res = new Array(length);
    res.fill({stroke:'#ffffff'});
    return res;
}

const xFromIndex = (index, cellWidth, cells) => {
    return index%cells*cellWidth;
}

const yFromIndex = (index, cellHeight, rows) => {
    return cellHeight * Math.floor(index / rows);
}