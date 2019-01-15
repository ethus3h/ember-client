async function dcDatasetLength(strDataset) {
    assertIsStr(strDataset); let intReturn;

    intReturn = await dcData[strDataset].length; await assertIsInt(intReturn); return intReturn;
}

async function dcDataLookupById(strDataset, intRowNumber, intFieldNumber) {
    await assertIsStr(strDataset); await assertIsInt(intRowNumber); await assertIsInt(intFieldNumber); let strReturn;

    strReturn = dcData[strDataset][intRowNumber].data[0][intFieldNumber]; await assertIsStr(strReturn); return strReturn;
}

async function dcDataLookupByValue(strDataset, intFilterField, genericFilterValue, intDesiredField) {
    await assertIsStr(strDataset); await assertIsInt(intFilterField); await assertIsGeneric(genericFilterValue); await assertIsInt(intDesiredField); let strReturn;

    let intLength = await intDcDataDatasetLength(strDataset);
    // start at 1 to skip header row
    let strFilterValue = await strFrom(genericFilterValue);
    for (let intRow = 1; intRow < intLength; intRow++) {
        if(dcData[strDataset][intRow].data[0][intFilterField] === strFilterValue) {
            strReturn = dcData[strDataset][intRow].data[0][intDesiredField]; await assertIsStr(strReturn); return strReturn;
        }
    }
    //await console.log("SEARCHING", strDataset, intFilterField, genericFilterValue, intDesiredField, dcData);
    // If nothing was found, return this UUID.
    strReturn="89315802-d53d-4d11-ba5d-bf505e8ed454"; await assertIsStr(strReturn); return strReturn;
}
