import { Config } from './Config';
import { CELL_DELIM, ROW_DELIM, scanForNextChar, scanForNextCharReverse } from './utils';

export class CsvRow {
    start = 0;
    end = 0;
    private csvBlob;
    private rowCursor: number | null = 0;
    private rowBlob;
    private rowDelim;
    private cellDelim;

    constructor(csvBlob: Blob, rowStartInBlob: number, rowEndInBlob: number, config?: Config) {
        this.csvBlob = csvBlob;
        this.start = rowStartInBlob;
        this.end = rowEndInBlob;
        this.rowBlob = csvBlob.slice(rowStartInBlob, rowEndInBlob);
        this.rowDelim = config?.rowDelim || ROW_DELIM;
        this.cellDelim = config?.cellDelim || CELL_DELIM;
    }

    async nextRow() {
        if (this.start === null) return null;
        const nextRowStartInBlob = this.end + this.rowDelim.length;
        if (nextRowStartInBlob >= this.csvBlob.size) {
            // Reached end of file
            return null;
        }
        const nextRowEnd = await this.nextRowOffset(nextRowStartInBlob);
        const nextRowEndInBlob = nextRowEnd === null
            ? this.csvBlob.size
            : nextRowEnd;        
        if (nextRowStartInBlob >= nextRowEndInBlob) {
            // Reached end of file
            return null;
        }
        const nextRow = new CsvRow(this.csvBlob, nextRowStartInBlob, nextRowEndInBlob);
        return nextRow;
    }

    async prevRow() {
        if (this.start === null) return null;
        const prevRowEndInBlob = this.start - this.rowDelim.length;
        if (prevRowEndInBlob <= 0) {
            // Reached start of file
            return null;
        }
        let prevRowStart = await this.prevRowOffset(prevRowEndInBlob);
        const prevRowStartInBlob = prevRowStart === null
            ? 0
            : prevRowStart + this.cellDelim.length;
        if (prevRowStartInBlob >= prevRowEndInBlob) {
            // Reached start of file            
            return null;
        }
        const prevRow = new CsvRow(this.csvBlob, prevRowStartInBlob, prevRowEndInBlob);
        return prevRow;    
    }

    private async nextRowOffset(start: number) {        
        let rowStartInBlob = await scanForNextChar(this.csvBlob, start, this.rowDelim);
        // Try to escape from double-quoted initial cursor position
        if (rowStartInBlob === null)
        rowStartInBlob = await scanForNextChar(this.csvBlob, start, this.rowDelim, true);
        return rowStartInBlob;
    }

    private async prevRowOffset(start: number) {
        let prevRowStart = await scanForNextCharReverse(this.csvBlob, start, this.rowDelim);        
        // Try to escape from double-quoted initial cursor position
        if (prevRowStart === null)
            prevRowStart = await scanForNextCharReverse(this.csvBlob, start, this.rowDelim, true);
        return prevRowStart;
    }

    async getCells() {
        const cells = new Array();
        let cellText = await this.nextCell();
        while (cellText !== null) {
            cells.push(cellText);
            cellText = await this.nextCell();
        }
        this.rowCursor = 0;
        return cells;
    }

    async nextCell() {
        if (this.rowCursor === null) return null;
        const nextOffset = await this.nextCellOffset(this.rowBlob, this.rowCursor);
        const slicedBlob = nextOffset === null 
            ? this.rowBlob.slice(this.rowCursor, this.rowBlob.size)
            : this.rowBlob.slice(this.rowCursor, nextOffset);
        let cellText = await slicedBlob.text();
        cellText = cellText.trim().replace('""', '"');
        
        if (cellText.length > 3 && cellText.startsWith('"') && cellText.endsWith('"')) {
            cellText = cellText.substring(1, cellText.length - 1);
        }
        this.rowCursor = nextOffset === null ? null : nextOffset + this.cellDelim.length;
        return cellText;
    }

    private async nextCellOffset(file: Blob, byte: number) {
        return await scanForNextChar(file, byte, this.cellDelim);
    }
}