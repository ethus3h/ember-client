// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

/* Note that the Basenb formats provided here are different from the Base16b formats in the specification, due to what appears to be a bug in the specification (requiring the remainder length to be stored to decode the remainder correctly when it starts with a 0 bit and is not 16 bits long). */

async function byteToIntBitArray(intIn) {
    await internalDebugCollect('int In = ' + intIn + '; '); await internalDebugStackEnter('byteToIntBitArray:basenb-utf8'); await assertIsInt(intIn); let intArrayReturn;

    await assertIsByte(intIn);
    let intArrayRes = [];
    let strTemp = '';
    strTemp = await intToBaseStr(intIn, 2);
    let intLen = 0;
    let intI = 0;
    intLen = await len(strTemp);
    let intArrayZero = [];
    intArrayZero = [ 0 ];
    while (await implLt(intI, intLen)) {
        intArrayRes = await push(intArrayRes, await intFromIntStr(await strChar(strTemp, intI)));
        intI = await implAdd(intI, 1);
    }
    while (await implGt(8, await count(intArrayRes))) {
        intArrayRes = await push(intArrayZero, intArrayRes);
    }
    await assertIsIntBitArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function byteFromIntBitArray(intArrayIn) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('byteFromIntBitArray:basenb-utf8'); await assertIsIntArray(intArrayIn); let intReturn;

    await assertIsIntBitArray(intArrayIn);
    let intRes = 0;
    let strTemp = '';
    let intLen = 0;
    let intI = 0;
    intLen = await count(intArrayIn);
    while (await implLt(intI, intLen)) {
        strTemp = await implCat(strTemp, await strFrom(await get(intArrayIn, intI)));
        intI = await implAdd(intI, 1);
    }
    intRes = await intFromBaseStr(strTemp, 2);
    await assertIsByte(intRes);

    intReturn = intRes; await assertIsInt(intReturn); await internalDebugStackExit(); return intReturn;
}

async function byteArrayToIntBitArray(intArrayIn) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('byteArrayToIntBitArray:basenb-utf8'); await assertIsIntArray(intArrayIn); let intArrayReturn;

    await assertIsByteArray(intArrayIn);
    let intArrayRes = [];
    let intLen = 0;
    let intI = 0;
    intLen = await count(intArrayIn);
    while (await implLt(intI, intLen)) {
        intArrayRes = await push(intArrayRes, await byteToIntBitArray(await get(intArrayIn, intI)));
        intI = await implAdd(intI, 1);
    }
    await assertIsIntBitArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function byteArrayFromIntBitArray(intArrayIn) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('byteArrayFromIntBitArray:basenb-utf8'); await assertIsIntArray(intArrayIn); let intArrayReturn;

    await assertIsIntBitArray(intArrayIn);
    let intArrayRes = [];
    let intLen = 0;
    let intI = 0;
    intLen = await count(intArrayIn);
    let intArrayTemp = [];
    while (await le(intI, intLen)) {
        if (await implAnd(await implEq(0, await implMod(intI, 8), ), await implNot(await implEq(0, await count(intArrayTemp))))) {
            intArrayRes = await push(intArrayRes, await byteFromIntBitArray(intArrayTemp));
            intArrayTemp = [  ];
        }
        if (await implLt(intI, intLen)) {
            intArrayTemp = await push(intArrayTemp, await get(intArrayIn, intI));
        }
        intI = await implAdd(intI, 1);
    }
    await assertIsByteArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function isBasenbBase(intBase) {
    await internalDebugCollect('int Base = ' + intBase + '; '); await internalDebugStackEnter('isBasenbBase:basenb-utf8'); await assertIsInt(intBase); let boolReturn;

    let boolRes = false;
    boolRes = await intIsBetween(intBase, 7, 17);
}

async function byteArrayToBasenbUtf8(intBase, intArrayIn) {
    await internalDebugCollect('int Base = ' + intBase + '; '); await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('byteArrayToBasenbUtf8:basenb-utf8'); await assertIsInt(intBase); await assertIsIntArray(intArrayIn); let intArrayReturn;

    await assertIsTrue(await isBasenbBase(intBase));
    await assertIsByteArray(intArrayIn);
    let intArrayRes = [];
    intArrayRes = await internalIntBitArrayToBasenbString(intBase, await byteArrayToIntBitArray(intArrayIn));
    /* The remainder length also needs to be stored, to be able to decode successfully. We'll calculate, encode, and append it. It's always 4 bytes, 1 UTF-8 character, and 2 UTF-16 characters long, after encoding (it has 2 added to it to make it always be the same byte length and UTF-16 length; this must be subtracted before passing it to the Base16b.decode function). */
    let intArrayRemainder = [];
    intArrayRemainder = await push(intArrayRemainder, await implAdd(2, await implMod(await count(intArrayIn), 17)));
    intArrayRes = await push(intArrayRes, await internalIntBitArrayToBasenbString(17, intArrayRemainder));
    await assertIsByteArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}

async function byteArrayFromBasenbUtf8(intArrayIn) {
    await internalDebugCollect('intArray In = ' + intArrayIn + '; '); await internalDebugStackEnter('byteArrayFromBasenbUtf8:basenb-utf8'); await assertIsIntArray(intArrayIn); let intArrayReturn;

    await assertIsByteArray(intArrayIn);
    let intArrayRes = [];
    /* Extract remainder length */
    let intRemainder = 0;
    let intArrayRemainderArr = [];
    intArrayRemainderArr = await anSubset(intArrayIn, -5, -1)/* last 4 characters */
    let intArrayRemainderDecodedArr = [];
    intArrayRemainderDecodedArr = await byteArrayFromIntBitArray(await internalIntBitArrayFromBasenbString(intArrayRemainderArr, 0));
    intRemainder = await get(intArrayRemainderDecodedArr, 0);
    intArrayRes = await byteArrayFromIntBitArray(await internalIntBitArrayFromBasenbString(intArrayIn, intRemainder));
    await assertIsByteArray(intArrayRes);

    intArrayReturn = intArrayRes; await assertIsIntArray(intArrayReturn); await internalDebugStackExit(); return intArrayReturn;
}
await byteArrayToBase17bUtf8(intArrayIn));
{
    /* Convenience wrapper */
    let intArrayRes = [];
    intArrayRes = await byteArrayToBasenbUtf8(17, intArrayIn);

    