# 𝄜 Partial CSV Reader
A library to parse any part of a large CSV file

## Installation

    npm i partial-csv-reader

## Usage

Create an instance of `CsvReader` from a `File`/`Blob` instance of the CSV file. You can get the file in the browser from an `<input type="file" />`:

    const csvFile = fileInputElement.files[0];
    const csvReader = new CsvReader(csvFile);


Next, you will need an instance of `CsvRow` that represents a single row in the CSV. You have three options:
- Getting the first row
- Getting the last row
- Getting a row anywhere in between by its byte / percentage offset in the file

You can use any, based on your preference:

    // Get the `CsvRow` of the first row
    csvRow = await csvReader.getFirstRow();

    // Get the `CsvRow` of the last row
    csvRow = await csvReader.getLastRow();

    // Get a row around the 50th percentile of the file
    csvRow = await csvReader.getRowAtPercent(50);

Now that you have the first row, you can navigate forward or backward from here to get other rows:

    // Get next row
    csvRow = await csvRow.nextRow();

    // Get previous row
    csvRow = await csvRow.prevRow();

Finally, you can get cell data on any desired row:

    cells = await csvRow.getCells();
    // ["Year", "Make", "Model"]

For a more detailed usage, see `src/example/index.ts`. To see it in action, you can open `example/app.html` in your browser after running `npm run build`.
