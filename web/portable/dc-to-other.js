// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Depends: (none)
*/

async function strPrintableDcToChar(dc, strCharacterEncoding) {
    await assertIsDc(dc); await assertIsStr(strCharacterEncoding); let strReturn;
    switch (strCharacterEncoding) {
        case "ASCII-safe-subset":
        case "UTF-8":
            strReturn = await strFromHex(await strDcDataLookupByValue("mappings/from/unicode", 1, dc, 0));
            assertIsStr(strReturn); return strReturn;
            break;
        case "HTML":
            try {/* FIXME THE BUG IS HERE */
                strReturn = await strFromHex(await strDcDataLookupByValue("mappings/from/unicode", 1, dc, 0));
            }
            catch {
                if (strReturn === "\u0000") {
                    /* No mapping was found by reversing Unicode, so look for a simple character mapping from the HTML mappings */
                    strReturn = await strDcDataLookupByValue("mappings/to/html", 0, dc, 1);
                }
            }
            assertIsStr(strReturn); return strReturn;
            break;
        default:
            await eiteError("Unimplemented character encoding: " + strCharacterEncoding);
            break;
    }
    assertIsStr(strReturn); return strReturn;
}

// @license-end
