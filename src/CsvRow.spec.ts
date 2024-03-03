import { CsvReader } from "./CsvReader";
import { CsvRow } from "./CsvRow";
import { TEST_CSV_STR } from "./CsvReader.spec";

const TEST_CSV_DATA = [
    ['Year', 'Level', 'City', 'Value'],
    ['2021', 'Level 1', 'London', '4,5'],
    ['2022', 'Level 2', 'Paris', '3,7'],
    ['2023', 'Level 3', 'Berlin', '4,1'],
    ['2024', 'Level 4', 'Porto', '3,9'],
    ['2025', 'Level 5', 'Milan', '3,4'],
];

describe('csvRow', () => {
    
    const file = new File([TEST_CSV_STR], 'test.csv');
    const csvReader = new CsvReader(file);

    test('first row to have correct start byte position', async () => {
        const firstRow = await csvReader.getFirstRow();
        expect(firstRow?.start).toBe(0);
    });

    test('first row to have correct cell values', async () => {
        const firstRow = await csvReader.getFirstRow();
        const firstRowCells = await firstRow?.getCells();
        expect(firstRowCells).toEqual(TEST_CSV_DATA[0]);
    });

    test('call nextRow on first row to return the correct values', async () => {
        const firstRow = await csvReader.getFirstRow();
        expect(firstRow).not.toBe(null);
        if (firstRow === null) return;
        let row: CsvRow | null = firstRow;
        let i = 0;
        while (row) {
            const cells = await row.getCells();
            expect(cells).toEqual(TEST_CSV_DATA[i]);
            row = await row.nextRow();
            i++;
        }
    });
    
    test('last row to have correct cell values', async () => {
        const lastRow = await csvReader.getLastRow();
        const lastRowCells = await lastRow?.getCells();
        expect(lastRowCells).toEqual(TEST_CSV_DATA[TEST_CSV_DATA.length - 1]);
    });

    test('call prevRow on last row to return the correct values', async () => {
        const lastRow = await csvReader.getLastRow();
        expect(lastRow).not.toBe(null);
        if (lastRow === null) return;
        let row: CsvRow | null = lastRow;
        let i = 0;
        while (row) {
            const cells = await row.getCells();
            expect(cells).toEqual(TEST_CSV_DATA[TEST_CSV_DATA.length - 1 - i]);            
            row = await row.prevRow();            
            i++;
        }
    });

    test('CsvReader.getRowAt to return correct values', async () => {
        const rowAt = await csvReader.getRowAt(60);        
        const rowAtCells = await rowAt?.getCells();
        expect(rowAtCells).toEqual(TEST_CSV_DATA[3]);
    });


});