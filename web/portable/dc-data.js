// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Depends:
    implIntDcDataDatasetLength
    implDcDataLookupById
    implDcDataLookupByValue
*/

async function intDcDataDatasetLength(strDataset) {
    assertIsStr(strDataset); let intReturn;

    intReturn = await implIntDcDataDatasetLength(strDataset); await assertIsInt(intReturn); return intReturn;
}

async function dcDataLookupById(strDataset, intRowNumber, intFieldNumber) {
    await assertIsStr(strDataset); await assertIsInt(intRowNumber); await assertIsInt(intFieldNumber); let strReturn;

    strReturn = await implDcDataLookupById(strDataset, intRowNumber, intFieldNumber); await assertIsStr(strReturn); return strReturn;
}

async function dcDataLookupByValue(strDataset, intFilterField, genericFilterValue, intDesiredField) {
    await assertIsStr(strDataset); await assertIsInt(intFilterField); await assertIsGeneric(genericFilterValue); await assertIsInt(intDesiredField); let strReturn;

    strReturn = await implDcDataLookupByValue(strDataset, intFilterField, genericFilterValue, intDesiredField); await assertIsStr(strReturn); return strReturn;
}

async function dcGetField(dc, intFieldNumber) {
    await assertIsDc(dc); await assertIsInt(intFieldNumber); let strReturn;

    strReturn = await dcDataLookupById("DcData", dc + 1, intFieldNumber); await assertIsStr(strReturn); return strReturn;
}

async function dcGetName(dc) {
    await assertIsDc(dc); let strReturn;

    strReturn = await dcGetField(dc, 1); await assertIsStr(strReturn); return strReturn;
}

async function dcGetCombiningClass(dc) {
    await assertIsDc(dc); let strReturn;

    strReturn = await dcGetField(dc, 2); await assertIsStr(strReturn); return strReturn;
}

async function dcGetBidiClass(dc) {
    await assertIsDc(dc); let strReturn;

    strReturn = await dcGetField(dc, 3); await assertIsStr(strReturn); return strReturn;
}

async function dcGetCasing(dc) {
    await assertIsDc(dc); let strReturn;

    strReturn = await dcGetField(dc, 4); await assertIsStr(strReturn); return strReturn;
}

async function dcGetType(dc) {
    await assertIsDc(dc); let strReturn;

    strReturn = await dcGetField(dc, 5); await assertIsStr(strReturn); return strReturn;
}

async function dcGetScript(dc) {
    await assertIsDc(dc); let strReturn;

    strReturn = await dcGetField(dc, 6); await assertIsStr(strReturn); return strReturn;
}

async function dcGetComplexTraits(dc) {
    await assertIsDc(dc); let strReturn;

    strReturn = await dcGetField(dc, 7); await assertIsStr(strReturn); return strReturn;
}

async function dcGetDescription(dc) {
    await assertIsDc(dc); let strReturn;

    strReturn = await dcGetField(dc, 8); await assertIsStr(strReturn); return strReturn;
}

// @license-end
