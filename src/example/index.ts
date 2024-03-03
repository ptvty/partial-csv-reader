import { CsvReader } from "../CsvReader";
import { CsvRow } from "../CsvRow";

async function example() {
    console.log('MAIN');
    
    let csv: CsvReader | null;
    let firstRow: CsvRow | null;
    let lastRow: CsvRow | null;

    const table = document.getElementById('data-table') as HTMLTableElement;

    const loadNext = document.getElementById('load-next') as HTMLButtonElement;
    loadNext.addEventListener('click', loadNextRows);

    const loadPrev = document.getElementById('load-prev') as HTMLButtonElement;
    loadPrev.addEventListener('click', loadPrevRows);

    const loadAt = document.getElementById('load-at') as HTMLButtonElement;
    loadAt.addEventListener('click', loadRowsAt);

    const csvFile = document.getElementById('csv-file') as HTMLInputElement;    
    csvFile.addEventListener('change', async () => {        
        const selctedFile = csvFile.files?.[0];
        if (!selctedFile) 
            return;
        csv = new CsvReader(selctedFile);
        lastRow = firstRow = await csv.getFirstRow();
        initRow();
        loadNextRows();
    });

    function appendRow (cells: string[]) {
        const tr = document.createElement('tr');
        for (const cell of cells) {
            const td = document.createElement('td');
            td.innerHTML = cell;
            tr.append(td);
        }
        table.append(tr);
    }

    function prependRow (cells: string[]) {
        const tr = document.createElement('tr');
        for (const cell of cells) {
            const td = document.createElement('td');
            td.innerHTML = cell;
            tr.append(td);
        }
        table.prepend(tr);
    }

    async function initRow() {
        const cells = await firstRow?.getCells();
        if (!cells)
            return;
        appendRow(cells);
    }

    async function loadNextRows() {
        for (let i = 1; i <= 10; i++) {
            lastRow = await lastRow?.nextRow() || null;
            const cells = await lastRow?.getCells();            
            if (!cells)
                break;
            appendRow(cells);
        }
    }

    async function loadPrevRows() {
        for (let i = 1; i <= 10; i++) {
            firstRow = await firstRow?.prevRow() || null;
            const cells = await firstRow?.getCells();                      
            if (!cells)
                break;
            prependRow(cells);
        }
    }

    async function loadRowsAt() {
        table.innerHTML = '';
        const percentInput = document.getElementById('percent') as HTMLInputElement;
        const percent = +percentInput.value;
        lastRow = firstRow = await csv?.getRowAtPercent(percent) || null;;
        initRow();
        loadNextRows();
    }

}

example();