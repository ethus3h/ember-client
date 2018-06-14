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

async function dcarrParseSems(bytearrayContent) {
    // Accepts an array of bytes of a SEMS format document. Returns an array of Dcs.
    let dcarrParseResults = [];
    let strParserState = "dc";
    let strCurrentDc = "";
    let intContentLength = await intBytearrayLength(bytearrayContent);
    for (let intByteOffset = 0; intByteOffset < await intBytearrayLength(bytearrayContent); intByteOffset++) {
        // do something with each byte in the array. bytearrayContent[intByteOffset] holds the decimal value of the given byte. These are Dcs encoded as ASCII text bytes, rather than an array of Dcs.
        switch (strParserState) {
            case "dc":
                if (await boolAsciiIsDigit(bytearrayContent[intByteOffset])) {
                    strCurrentDc = strCurrentDc + await strFromByte(bytearrayContent[intByteOffset]);
                }
                if (await boolAsciiIsSpace(bytearrayContent[intByteOffset])) {
                    dcarrParseResults.push(strCurrentDc);
                    strCurrentDc = "";
                }
                if (bytearrayContent[intByteOffset] == 35) { // pound sign: start comment
                    strParserState = "comment";
                }
                break;
            case "comment":
                if (await boolAsciiIsNewline(bytearrayContent[intByteOffset])) {
                    strParserState = "dc";
                }
                break;
        }
    }
    return dcarrParseResults;
}

// @license-end
