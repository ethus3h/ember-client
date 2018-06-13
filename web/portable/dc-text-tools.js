// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Depends:
    implAssertIsInt
    implAssertIsStr
    implAssertStrContainsOnlyInt
*/

async function intDcIdToCsvRow(dc) {
    await assertIsDc(dc); let intReturn;
    intReturn = await intFromStr(dc) + 1; await assertIsInt(intReturn); return intReturn;
}

async function strDcDataLookupById(strDataset, dc, intFieldNumber) {
    await assertIsStr(strDataset); await assertIsDc(dc); await assertIsInt(intFieldNumber); let strReturn;

    strReturn = dcData[strDataset][await intDcIdToCsvRow(dc)].data[0][intFieldNumber]; await assertIsStr(strReturn); return strReturn;
}

async function strDcDataLookupByValue(strDataset, filterField, filterValue, desiredField) {
    let strReturn;

    let intLength = dcData[strDataset].length;
    // start at 1 to skip header row
    for (let intRow = 1; intRow < intLength; intRow++) {
        if(dcData[strDataset][intRow].data[0][filterField] === filterValue) {
            strReturn = dcData[strDataset][intRow].data[0][desiredField]; await assertIsStr(strReturn); return strReturn;
        }
    }
    await assertIsStr(strReturn); return strReturn;
}

async function strDcGetField(dc, intFieldNumber) {
    await assertIsDc(dc); await assertIsInt(intFieldNumber); let strReturn;

    strReturn = await strDcDataLookupById("DcData", dc, intFieldNumber); await assertIsStr(strReturn); return strReturn;
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

async function boolDcIsNewline(dc) {
    await assertIsDc(dc); let boolReturn;

    if(await strDcGetBidiClass(dc) === 'B') {
        boolReturn = true; await assertIsBool(boolReturn); return boolReturn;
    }
    boolReturn = false; await assertIsBool(boolReturn); return boolReturn;
}

async function boolDcIsPrintable(dc) {
    await assertIsDc(dc); let boolReturn;

    let strType = await strDcGetType(dc);
    let strGeneralType = strType[0];
    switch(strType) {
        case 'Zl':
        case 'Zp':
            boolReturn = false; await assertIsBool(boolReturn); return boolReturn;
            break;
        default:
            break;
    }
    switch(strGeneralType) {
        case '!':
        case 'C':
            boolReturn = false; await assertIsBool(boolReturn); return boolReturn;
            break;
        default:
            break;
    }
    boolReturn = true; await assertIsBool(boolReturn); return boolReturn;
}

// @license-end
