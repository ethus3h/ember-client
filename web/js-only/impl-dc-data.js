// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Depends:
    implIntBytearrayLength
    implIntDcarrLength
*/

async function implIntDcDataDatasetLength(strDataset) {
    assertIsStr(strDataset); let intReturn;

    intReturn = await dcData[strDataset].length; await assertIsInt(intReturn); return intReturn;
}

// @license-end
