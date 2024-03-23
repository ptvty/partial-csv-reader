import { ROW_DELIM, scanForNextChar, scanForNextCharReverse } from "./utils";
import { CsvRow } from "./CsvRow";
import { Config } from "./Config";

export class CsvReader {
    private blob: Blob;
    private config;
    private rowDelim;

    constructor (csvBlob: Blob, config?: Config) {
        this.blob = csvBlob;
        this.rowDelim = config?.rowDelim || ROW_DELIM;
        this.config = config;
    }

    async getFirstRow() {
        const rowEndInBlob = await this.nextRowStart(0);
        if (rowEndInBlob === null) return null;
        const csvRow = new CsvRow(this.blob, 0, rowEndInBlob, this.config);
        return csvRow;
    }

    async getLastRow() {
        const rowStartInBlob = await this.prevRowStart(this.blob.size);
        if (rowStartInBlob === null) return null;
        const csvRow = new CsvRow(this.blob, rowStartInBlob, this.blob.size, this.config);
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
        const rowEndInBlob = await this.nextRowStart(rowStartInBlob + this.rowDelim.length);
        const csvRow = new CsvRow(this.blob, rowStartInBlob, rowEndInBlob || this.blob.size, this.config);
        return csvRow;
    }

    async getRowAtPercent(percent: number) {
        const positionInBlob = this.blob.size * percent / 100;
        return await this.getRowAt(positionInBlob);
    }

    private async nextRowStart(scanStart: number) {
        let indexInBlob = await scanForNextChar(this.blob, scanStart, this.rowDelim);
        // Try to escape from double-quoted start position
        if (indexInBlob === null)
            indexInBlob = await scanForNextChar(this.blob, scanStart, this.rowDelim, true);
        return indexInBlob;
    }

    private async prevRowStart(scanStart: number) {
        let indexInBlob = await scanForNextCharReverse(this.blob, scanStart, this.rowDelim);
        // Try to escape from double-quoted start position
        if (indexInBlob === null)
            indexInBlob = await scanForNextCharReverse(this.blob, scanStart, this.rowDelim, true);
        return indexInBlob === null ? null : indexInBlob + this.rowDelim.length;
    }

}
