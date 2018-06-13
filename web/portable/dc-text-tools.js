// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Depends:
    implAssertIsInt
    implAssertIsStr
    implAssertStrContainsOnlyInt
*/

    async function intDcIdToCsvRow(dc) {
        await assertIsDc(dc);
        return await intFromStr(dc) + 1;
    }
    async function strDcDataLookupById(strDataset, dc, intFieldNumber) {
        await assertIsStr(strDataset); await assertIsDc(dc); await assertIsInt(intFieldNumber);
        return dcData[strDataset][await intDcIdToCsvRow(dc)].data[0][intFieldNumber];
    }
    async function strDcDataLookupByValue(strDataset, filterField, filterValue, desiredField) {
        let intLength = dcData[strDataset].length;
        // start at 1 to skip header row
        for (let intRow = 1; intRow < intLength; intRow++) {
            if(dcData[strDataset][intRow].data[0][filterField] === filterValue) {
                return dcData[strDataset][intRow].data[0][desiredField];
            }
        }
    }
    async function strDcGetField(dc, intFieldNumber) {
        return await strDcDataLookupById("DcData", dc, intFieldNumber);
    }
    async function strDcGetName(dc) {
        return await strDcGetField(dc, 1);
    }
    async function strDcGetCombiningClass(dc) {
        return await strDcGetField(dc, 2);
    }
    async function strDcGetBidiClass(dc) {
        return await strDcGetField(dc, 3);
    }
    async function strDcGetCasing(dc) {
        return await strDcGetField(dc, 4);
    }
    async function strDcGetType(dc) {
        return await strDcGetField(dc, 5);
    }
    async function strDcGetScript(dc) {
        return await strDcGetField(dc, 6);
    }
    async function strDcGetComplexTraits(dc) {
        return await strDcGetField(dc, 7);
    }
    async function strDcGetDescription(dc) {
        return await strDcGetField(dc, 8);
    }

    async function boolDcIsNewline(dc) {
        if(await strDcGetBidiClass(dc) === 'B') {
            return true;
        }
        return false;
    }

    async function boolDcIsPrintable(dc) {
        let strType = await strDcGetType(dc);
        let strGeneralType = strType[0];
        switch(strType) {
            case 'Zl':
            case 'Zp':
                return false;
                break;
            default:
                break;
        }
        switch(strGeneralType) {
            case '!':
            case 'C':
                return false;
                break;
            default:
                break;
        }
        return true;
    }

// @license-end
