import { CsvReader } from "./CsvReader";
import { CsvRow } from "./CsvRow";

export const TEST_CSV_STR = `Year,Level,City,Value
2021,Level 1,London,"4,5"
2022,Level 2,Paris,"3,7"
2023,Level 3,Berlin,"4,1"
2024,Level 4,Porto,"3,9"
2025,Level 5,Milan,"3,4"`;

const MALFORMED_CSV_STR = `hello world`;

describe('CsvReader', () => {

    const file = new File([TEST_CSV_STR], 'test.csv');
    const csvReader = new CsvReader(file, { rowDelim: "\n", cellDelim: "," });

    test('CsvReader.getFirstRow to return valid CsvRow', async () => {
        const firstRow = await csvReader.getFirstRow();
        expect(firstRow).not.toBe(null);
        expect(firstRow).toBeInstanceOf(CsvRow);
    });

    test('CsvReader.getLastRow to return valid CsvRow', async () => {
        const lastRow = await csvReader.getLastRow();
        expect(lastRow).not.toBe(null);
        expect(lastRow).toBeInstanceOf(CsvRow);
    });

    test('CsvReader.getRowAt to return valid CsvRow', async () => {
        const rowAt = await csvReader.getRowAt(60);
        expect(rowAt).not.toBe(null);
        expect(rowAt).toBeInstanceOf(CsvRow);
    });

    test('CsvReader.getRowAt to return valid CsvRow when position is in double quote', async () => {
        const rowAt = await csvReader.getRowAt(69);
        expect(rowAt).not.toBe(null);
        expect(rowAt).toBeInstanceOf(CsvRow);
    });

    test('CsvReader.getRowAtPercent to return valid CsvRow', async () => {
        const rowAt = await csvReader.getRowAtPercent(50);
        expect(rowAt).not.toBe(null);
        expect(rowAt).toBeInstanceOf(CsvRow);
    });

    test('CsvReader.getRowAt to return valid CsvRow when position is in double quote and last row', async () => {
        const rowAt = await csvReader.getRowAt(148);
        expect(rowAt).not.toBe(null);
        expect(rowAt).toBeInstanceOf(CsvRow);
    });

    test('CsvReader.getRowAt to throw an exception for wrong position', () => {
        expect(async () => {
            await csvReader.getRowAt(150);
        }).rejects.toThrow()
    });

    test('CsvReader.getRowAt to return null if malformed data provided', async () => {
        const file = new File([MALFORMED_CSV_STR], 'maltest.csv');
        const csvReader = new CsvReader(file);
        let row = await csvReader.getRowAt(2)
        expect(row).toBe(null);
        row = await csvReader.getFirstRow()
        expect(row).toBe(null);
        row = await csvReader.getLastRow()
        expect(row).toBe(null);
    });

});