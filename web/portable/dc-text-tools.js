// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Depends:
    implAssertIsInt
    implAssertIsStr
    implAssertStrContainsOnlyInt
*/

async function boolDcIsNewline(dc) {
    await assertIsDc(dc); let boolReturn;

    if(await strDcGetBidiClass(dc) === "B") {
        boolReturn = true; await assertIsBool(boolReturn); return boolReturn;
    }
    boolReturn = false; await assertIsBool(boolReturn); return boolReturn;
}

async function boolDcIsPrintable(dc) {
    await assertIsDc(dc); let boolReturn;

    let strType = await strDcGetType(dc);
    let strGeneralType = await strCharAtPos(strType, 0);
    switch(strType) {
        case "Zl":
        case "Zp":
            boolReturn = false; await assertIsBool(boolReturn); return boolReturn;
            break;
        default:
            break;
    }
    switch(strGeneralType) {
        case "!":
        case "C":
            boolReturn = false; await assertIsBool(boolReturn); return boolReturn;
            break;
        default:
            break;
    }
    boolReturn = true; await assertIsBool(boolReturn); return boolReturn;
}

// @license-end
