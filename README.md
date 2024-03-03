# 𝄜 Partial CSV Reader
A library to parse any part of a large CSV file

## Installation

    npm i @ptvty/csv-reader

## Usage

Create an instance of `CsvReader` from a `File`/`Blob` instance of the CSV file. You can get the file in the browser from an `<input type="file" />`:

    const csvFile = fileInputElement.files[0];
    const csvReader = new CsvReader(csvFile);


Next, you will need an instance of `CsvRow` which represents a single row in the CSV, you have three options:
- Getting the first row
- Getting the last row
- Getting a row anywhere in between by it's byte / percentage offset in the file

You can use any, based on your preference:

    // Get the `CsvRow` of the first row
    csvRow = await csvReader.getFirstRow();

    // Get the `CsvRow` of the last row
    csvRow = await csvReader.getLastRow();

    // Get a row around the 50th percentile of the file
    csvRow = await csvReader.getRowAtPercent(50);

Now you have the first row, you can navigate forward or backward from here to get other rows:

    // Get next row
    csvRow = await csvRow.nextRow();

    // Get previous row
    csvRow = await csvRow.prevRow();

Finally, you can get the cells data on any desired row:

    cells = await csvRow.getCells();
    // ["Year", "Make", "Model"]

See `src/example/index.ts` for a more detailed usage. To see it in action, you can open `example/app.html` in your browser after running `npm run build`.
