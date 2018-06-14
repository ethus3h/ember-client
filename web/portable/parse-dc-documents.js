// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Depends: (none)
*/

async function dcarrParseDocument(strFormat, bytearrayContent) {
    await assertIsStr(strFormat); await assertIsBytearray(bytearrayContent); let dcarrReturn;

    switch (strFormat) {
        case "sems":
            dcarrReturn = await dcarrParseSems(bytearrayContent); await assertIsDcarr(dcarrReturn); return dcarrReturn;
            break;
        default:
            await eiteError("Unimplemented document parsing format: " + strFormat);
            break;
    }
    await assertIsDcarr(dcarrReturn); return dcarrReturn;
}

// @license-end
