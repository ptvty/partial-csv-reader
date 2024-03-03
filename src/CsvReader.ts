import { ROW_DELIM, scanForNextChar, scanForNextCharReverse } from "./utils";
import { CsvRow } from "./CsvRow";

export class CsvReader {
    private blob: Blob;

    constructor (csvBlob: Blob) {
        this.blob = csvBlob;
    }

    async getFirstRow() {
        const rowEndInBlob = await this.nextRowStart(0);
        if (rowEndInBlob === null) return null;
        const csvRow = new CsvRow(this.blob, 0, rowEndInBlob);
        return csvRow;
    }

    async getLastRow() {
        const rowStartInBlob = await this.prevRowStart(this.blob.size);
        if (rowStartInBlob === null) return null;
        const csvRow = new CsvRow(this.blob, rowStartInBlob, this.blob.size);
        return csvRow;
    }

    async getRowAt(positionInBlob: number) {
        let rowStartInBlob;
        rowStartInBlob = await this.nextRowStart(positionInBlob);
        if (rowStartInBlob === null) {
            rowStartInBlob = await this.prevRowStart(positionInBlob);
        }
        if (rowStartInBlob === null) {
            return null;
        }
        const rowEndInBlob = await this.nextRowStart(rowStartInBlob + ROW_DELIM.length);
        const csvRow = new CsvRow(this.blob, rowStartInBlob, rowEndInBlob || this.blob.size);
        return csvRow;
    }

    async getRowAtPercent(percent: number) {
        const positionInBlob = this.blob.size * percent / 100;
        return await this.getRowAt(positionInBlob);
    }

    private async nextRowStart(scanStart: number) {
        let indexInBlob = await scanForNextChar(this.blob, scanStart, ROW_DELIM);
        // Try to escape from double-quoted start position
        if (indexInBlob === null)
            indexInBlob = await scanForNextChar(this.blob, scanStart, ROW_DELIM, true);
        return indexInBlob;
    }

    private async prevRowStart(scanStart: number) {
        let indexInBlob = await scanForNextCharReverse(this.blob, scanStart, ROW_DELIM);
        // Try to escape from double-quoted start position
        if (indexInBlob === null)
            indexInBlob = await scanForNextCharReverse(this.blob, scanStart, ROW_DELIM, true);
        return indexInBlob === null ? null : indexInBlob + ROW_DELIM.length;
    }

}
