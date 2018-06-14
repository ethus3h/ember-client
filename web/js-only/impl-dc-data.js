// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Provides:
    implIntDcDataDatasetLength
    implStrDcDataLookupById
*/

async function implIntDcDataDatasetLength(strDataset) {
    assertIsStr(strDataset); let intReturn;

    intReturn = await dcData[strDataset].length; await assertIsInt(intReturn); return intReturn;
}

async function implStrDcDataLookupById(strDataset, intRowNumber, intFieldNumber) {
    await assertIsStr(strDataset); await assertIsDc(dc); await assertIsInt(intFieldNumber); let strReturn;

    strReturn = dcData[strDataset][await intDcIdToCsvRow(dc)].data[0][intFieldNumber]; await assertIsStr(strReturn); return strReturn;
}

// @license-end
