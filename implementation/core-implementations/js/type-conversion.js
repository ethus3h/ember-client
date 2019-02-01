/* type-conversion, provides:
    intFromIntStr
    strFrom
    charFromByte
    byteFromChar
*/

async function intFromIntStr(str) {
    await assertStrContainsOnlyInt(str); let intReturn;

    intReturn = parseInt(str, 10); await assertIsInt(intReturn); return intReturn;
}

async function strFrom(input) {
    await assertIsGeneric(input); let strReturn;

    strReturn = String(input); await assertIsStr(strReturn); return strReturn;
}

async function charFromByte(intInput) {
    await assertIsInt(intInput); let strReturn;

    // Expects a decimal byte as input. Bear in mind that StageL doesn't attempt to support Unicode.

    strReturn = String.fromCharCode(intInput); await assertIsStr(strReturn); return strReturn;
}

async function byteFromChar(strInput) {
    await assertIsStr(strInput);
    // Bear in mind that StageL doesn't attempt to support Unicode.
    // We can't use assertIsChar here, because it depends on byteFromChar.
    let intReturn;
    intReturn = strInput.charCodeAt(0);

    await assertIsTrue(intReturn > 31);
    await assertIsTrue(intReturn < 127);

    await assertIsInt(intReturn); return intReturn;
}

async function utf8BytesFromDecimalChar(intInput) {
    // Returns a Uint8 array of bytes representing the UTF-8 encoding of the character, given decimal representation of the character as input. FIXME: Probably doesn't support unpaired surrogates or byte sequences outside of the range allowed by Unicode characters, but it probably should.
    let utf8encoder = new TextEncoder();
    return utf8encoder.encode(String.fromCodePoint(intInput));
}

async function firstCharOfUtf8String(intArrayInput) {
    // Returns a decimal representing the UTF-8 encoding of the first character, given decimal representation of a string as input.
    let utf8decoder = new TextDecoder();
    alert( utf8decoder.decode(new Uint8Array(intArrayInput)).codePointAt(0));
    return utf8decoder.decode(new Uint8Array(intArrayInput)).codePointAt(0);
}
