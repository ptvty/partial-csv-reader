export const ROW_DELIM = "\n";
export const CELL_DELIM = ",";
export const MAX_SCAN_BYTES = 1_000;

export async function scanForNextChar(file: Blob, start: number, char: string, inDoubleQuot = false) {
    if (start > file.size) {
        throw Error('Start byte should be smaller than file size')
    }
    const doubleQuot = '"';
    const maxByte = Math.min(file.size, start + MAX_SCAN_BYTES);
    for (let b = start; b < maxByte; b++) {
        const slicedBlob = file.slice(b, b + 1);
        const text = await slicedBlob.text();
        if (text === doubleQuot) {
            inDoubleQuot = !inDoubleQuot;
            continue;
        }
        if (text === char && inDoubleQuot === false) {
            return b;
        }
    }
    return null;
}

export async function scanForNextCharReverse(file: Blob, start: number, char: string, inDoubleQuot = false) {
    if (start > file.size) {
        throw Error('Start byte should be smaller than file size')
    }
    const doubleQuot = '"';
    const minByte = Math.max(1, start - MAX_SCAN_BYTES);
    for (let b = start; b > minByte; b--) {
        const slicedBlob = file.slice(b - 1, b);
        const text = await slicedBlob.text();
        if (text === doubleQuot) {
            inDoubleQuot = !inDoubleQuot;
            continue;
        }
        if (text === char && inDoubleQuot === false) {
            return b - 1;
        }
    }
    return null;
}