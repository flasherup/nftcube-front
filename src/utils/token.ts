import {CHUNKS_IN_CELL, CHUNKS_IN_ROW, INDEX_MAX, INDEX_MIN} from "../constants";

export const tokenToCoordinates = (token:string, ):number[] => {
    let index = parseInt(token);
    if (index < INDEX_MIN) index = INDEX_MIN;
    if (index > INDEX_MAX) index = INDEX_MAX;
    const p = index-1;
    const row = Math.floor(p/CHUNKS_IN_CELL)+1;
    const column = p%CHUNKS_IN_ROW+1;

    return [row, column];
}