// Note: Both rows and columns are zero-indexed from the perspective of callers of these routines. The header row is not counted for this purpose (the first row after the header is index 0), while the ID column (where present) *is* counted (so it is index 0).

async function dcDatasetLength(dataset) {
    assertIsDcDataset(dataset); let intReturn;

    // - 2: one for the header; one for the last newline, which is (reasonably, looking at the newlines as separators rather than terminators) included as an extra line of data in the parse results
    intReturn = await dcData[dataset].length - 2; await assertIsInt(intReturn); return intReturn;
}

async function dcDataLookupById(dataset, rowNum, fieldNum) {
    await assertIsDcDataset(dataset); await assertIsInt(rowNum); await assertIsInt(fieldNum); let strReturn;

    // This routine returns the value of the specified cell of the nth row in the dataset (zero-indexed, such that the 0th row is the first content row, and the header row is not available (would be -1 but isn't available from this routine)).
    if (dcData[dataset] === undefined) {
        await implDie('dcDataLookupById called, but dataset '+dataset+' does not appear to be available.');
    }

    // Add 1 to account for header row
    rowNum = rowNum + 1;

    if (rowNum >= dcData[dataset].length) {
        strReturn = "89315802-d53d-4d11-ba5d-bf505e8ed454"
    }
    else {
        strReturn = dcData[dataset][rowNum][fieldNum];
    }
    await assertIsStr(strReturn); return strReturn;
}

async function dcDataLookupByValue(dataset, filterField, genericFilterValue, desiredField) {
    await assertIsDcDataset(dataset); await assertIsInt(filterField); await assertIsGeneric(genericFilterValue); await assertIsInt(desiredField); let strReturn;

    let intLength = dcData[dataset].length - 2;
    // start at 1 to skip header row
    let filterValue = await strFrom(genericFilterValue);
    for (let row = 1; row <= intLength; row++) {
        if(dcData[dataset][row][filterField] === filterValue) {
            strReturn = dcData[dataset][row][desiredField]; await assertIsStr(strReturn); return strReturn;
        }
    }
    //await console.log("SEARCHING", dataset, filterField, genericFilterValue, desiredField, dcData);
    //await implDie('Could not find required dataset entry by value (parameters: '+dataset+'/'+filterField+'/'+genericFilterValue+'/'+desiredField+').');
    // TODO: this should be available as a "lookupbyvalue" and a "lookupbyvalueForgiving" versions that do and don't die on this; the forgiving would return the exception UUID.
    // If nothing was found, return this UUID.
    strReturn="89315802-d53d-4d11-ba5d-bf505e8ed454"; await assertIsStr(strReturn); return strReturn;
}

async function dcDataFilterByValue(dataset, filterField, genericFilterValue, desiredField) {
    await assertIsDcDataset(dataset); await assertIsInt(filterField); await assertIsGeneric(genericFilterValue); await assertIsInt(desiredField); let asReturn;

    // This routine returns an array of values of the desired column when the filter field matches the filter value. While dcDataLookupByValue gives a single (the first) result, this returns all matching results.

    asReturn = [];

    let intLength = dcData[dataset].length - 2;
    // start at 1 to skip header row
    let filterValue = await strFrom(genericFilterValue);
    for (let row = 1; row <= intLength; row++) {
        if(dcData[dataset][row][filterField] === filterValue) {
            asReturn = asReturn.concat(dcData[dataset][row][desiredField]);
        }
    }
    await assertIsStrArray(asReturn); return asReturn;
}

async function dcDataFilterByValueGreater(dataset, filterField, filterValue, desiredField) {
    await assertIsDcDataset(dataset); await assertIsInt(filterField); await assertIsInt(filterValue); await assertIsInt(desiredField); let asReturn;

    // This routine returns an array of values of the desired column when the filter field is greater than the filter value. (e.g. filter for 1 will return rows with 2 and 3 but not 1 or 0) While dcDataLookupByValue gives a single (the first) result, this returns all matching results.

    asReturn = [];

    let intLength = dcData[dataset].length - 2;
    // start at 1 to skip header row
    for (let row = 1; row <= intLength; row++) {
        if(parseInt(dcData[dataset][row][filterField], 10) > filterValue) {
            asReturn = asReturn.concat(dcData[dataset][row][desiredField]);
        }
    }
    await assertIsStrArray(asReturn); return asReturn;
}

async function getImportSettings(formatId) {
    await assertIsStrArray(importSettings); await assertIsInt(formatId)

    return importSettings[formatId];
}

async function getExportSettings(formatId) {
    await assertIsStrArray(exportSettings); await assertIsInt(formatId);

    return exportSettings[formatId];
}

async function setImportSettings(strArrayNewSettings) {
    await assertIsStrArray(strArrayNewSettings); window.importSettings=strArrayNewSettings;
}

async function setExportSettings(strArrayNewSettings) {
    await assertIsStrArray(strArrayNewSettings); window.exportSettings=strArrayNewSettings;
}
