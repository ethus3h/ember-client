// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Depends: (none)
*/

async function strPrintableDcToChar(dc, strCharacterEncoding) {
    switch (strCharacterEncoding) {
        case "ASCII-safe-subset":
        case "UTF-8":
            return await strFromUnicodeHex(await strDcDataLookupByValue("mappings/from/unicode", 1, dc, 0));
            break;
        default:
            await eiteError("Unimplemented character encoding: " + strCharacterEncoding);
            break;
    }
}

// @license-end
