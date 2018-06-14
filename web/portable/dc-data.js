// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Depends:
    implIntBytearrayLength
    implIntDcarrLength
*/

async function intDcDataDatasetLength(strDataset) {
    assertIsStr(strDataset); let intReturn;

    intReturn = await implIntDcDataDatasetLength(strDataset); await assertIsInt(intReturn); return intReturn;
}

async function intDcIdToCsvRow(dc) {
    await assertIsDc(dc); let intReturn;
    intReturn = await intFromStr(dc) + 1; await assertIsInt(intReturn); return intReturn;
}

async function strDcDataLookupById(strDataset, intRowNumber, intFieldNumber) {
    await assertIsStr(strDataset); await assertIsInt(intRowNumber); await assertIsInt(intFieldNumber); let strReturn;

    strReturn = await implStrDcDataLookupById(strDataset, intRowNumber, intFieldNumber); await assertIsStr(strReturn); return strReturn;
}

async function strDcDataLookupByValue(strDataset, intFilterField, strFilterValue, intDesiredField) {
    await assertIsStr(strDataset); await assertIsInt(intFilterField); await assertIsStr(strFilterValue); await assertIsInt(intDesiredField); let strReturn;

    let intLength = await intDcDataDatasetLength(strDataset);
    // start at 1 to skip header row
    for (let intRow = 1; intRow < intLength; intRow++) {
        if(dcData[strDataset][intRow].data[0][intFilterField] === strFilterValue) {
            strReturn = dcData[strDataset][intRow].data[0][intDesiredField]; await assertIsStr(strReturn); return strReturn;
        }
    }
    await assertIsStr(strReturn); return strReturn;
}

async function strDcGetField(dc, intFieldNumber) {
    await assertIsDc(dc); await assertIsInt(intFieldNumber); let strReturn;

    strReturn = await strDcDataLookupById("DcData", await intFromStr(dc), intFieldNumber); await assertIsStr(strReturn); return strReturn;
}

async function strDcGetName(dc) {
    await assertIsDc(dc); let strReturn;

    strReturn = await strDcGetField(dc, 1); await assertIsStr(strReturn); return strReturn;
}

async function strDcGetCombiningClass(dc) {
    await assertIsDc(dc); let strReturn;

    strReturn = await strDcGetField(dc, 2); await assertIsStr(strReturn); return strReturn;
}

async function strDcGetBidiClass(dc) {
    await assertIsDc(dc); let strReturn;

    strReturn = await strDcGetField(dc, 3); await assertIsStr(strReturn); return strReturn;
}

async function strDcGetCasing(dc) {
    await assertIsDc(dc); let strReturn;

    strReturn = await strDcGetField(dc, 4); await assertIsStr(strReturn); return strReturn;
}

async function strDcGetType(dc) {
    await assertIsDc(dc); let strReturn;

    strReturn = await strDcGetField(dc, 5); await assertIsStr(strReturn); return strReturn;
}

async function strDcGetScript(dc) {
    await assertIsDc(dc); let strReturn;

    strReturn = await strDcGetField(dc, 6); await assertIsStr(strReturn); return strReturn;
}

async function strDcGetComplexTraits(dc) {
    await assertIsDc(dc); let strReturn;

    strReturn = await strDcGetField(dc, 7); await assertIsStr(strReturn); return strReturn;
}

async function strDcGetDescription(dc) {
    await assertIsDc(dc); let strReturn;

    strReturn = await strDcGetField(dc, 8); await assertIsStr(strReturn); return strReturn;
}

// @license-end
