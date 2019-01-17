async function dcDatasetLength(dataset) {
    assertIsDcDataset(dataset); let intReturn;

    intReturn = await dcData[dataset].length; await assertIsInt(intReturn); return intReturn;
}

async function dcDataLookupById(dataset, rowNum, fieldNum) {
    await assertIsDcDataset(dataset); await assertIsInt(rowNum); await assertIsInt(fieldNum); let strReturn;

    if (dcData[dataset] === undefined) {
        console.log(dcData);
        assertFailed('DcData for the dataset '+dataset+' does not seem to be available. Setup finished: '+setupFinished);
    }

    strReturn = dcData[dataset][rowNum].data[0][fieldNum]; await assertIsStr(strReturn); return strReturn;
}

async function dcDataLookupByValue(dataset, filterField, genericFilterValue, desiredField) {
    await assertIsDcDataset(dataset); await assertIsInt(filterField); await assertIsGeneric(genericFilterValue); await assertIsInt(desiredField); let strReturn;

    let intLength = await dcDatasetLength(dataset);
    // start at 1 to skip header row
    let filterValue = await strFrom(genericFilterValue);
    for (let row = 1; row < intLength; row++) {
        if(dcData[dataset][row].data[0][filterField] === filterValue) {
            strReturn = dcData[dataset][row].data[0][desiredField]; await assertIsStr(strReturn); return strReturn;
        }
    }
    //await console.log("SEARCHING", dataset, filterField, genericFilterValue, desiredField, dcData);
    // If nothing was found, return this UUID.
    strReturn="89315802-d53d-4d11-ba5d-bf505e8ed454"; await assertIsStr(strReturn); return strReturn;
}
