// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

async function strCharAtPos(strStr, intIndex) {
    await assertIsStr(strStr); await assertIsInt(intIndex); let strReturn;

    let strTemp = '';
    strTemp = await substring(strStr, intIndex, 1);

    strReturn = strTemp; await assertIsStr(strReturn); return strReturn;
}
async function or(boolA, boolB) {
    await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(boolA);
    boolTemp = await implNot(await implAnd(boolTemp, await implNot(boolB)));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

async function nor(boolA, boolB) {
    await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await or(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

async function nand(boolA, boolB) {
    await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await implAnd(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

async function xor(boolA, boolB) {
    await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = await nand(boolA, boolB);
    boolTemp = await implAnd(boolTemp, await or(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

async function xnor(boolA, boolB) {
    await assertIsBool(boolA); await assertIsBool(boolB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await xor(boolA, boolB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}
async function assertIsByte(intIn) {
    await assertIsInt(intIn); let voidReturn;

    let boolTemp = false;
    boolTemp = await le(intIn, 255);
    let strIn = '';
    strIn = await strFromInt(intIn);
    if (await implNot(await implAnd(boolTemp, await ge(intIn, 0)))) {
        await implDie(await implCat('Assertion failed: ', await implCat(strIn, ' is not a byte.')));
    }
}

async function assertIsArray(genericArrayIn) {
    await assertIsGenericArray(genericArrayIn); let voidReturn;

    /* Just a convenience wrapper */
    await assertIsGenericArray(genericArrayIn);
}
/* Calling a comparison with different types is an error. All types must be same type. */

async function ne(genericA, genericB) {
    await assertIsGeneric(genericA); await assertIsGeneric(genericB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await implEq(genericA, genericB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

async function ge(intA, intB) {
    await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implEq(intA, intB);
    boolTemp = await or(boolTemp, await implGt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

async function le(intA, intB) {
    await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implEq(intA, intB);
    boolTemp = await or(boolTemp, await implLt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

async function ngt(intA, intB) {
    await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await implGt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

async function nlt(intA, intB) {
    await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await implLt(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

async function nge(intA, intB) {
    await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await ge(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}

async function nle(intA, intB) {
    await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    let boolTemp = false;
    boolTemp = await implNot(await le(intA, intB));

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}
async function intIsBetween(intN, intA, intB) {
    await assertIsInt(intN); await assertIsInt(intA); await assertIsInt(intB); let boolReturn;

    /* Checks whether N is within the range A and B, including endpoints */
    let intT1 = 0;
    intT1 = await implSub(intN, intA);
    let intT2 = 0;
    intT2 = await implSub(intN, intB);
    let intT3 = 0;
    intT3 = await implMul(intT1, intT2);
    let boolTemp = false;
    boolTemp = await le(intT3, 0);

    boolReturn = boolTemp; await assertIsBool(boolReturn); return boolReturn;
}
async function strPrintArr(genericArrayInput) {
    await assertIsGenericArray(genericArrayInput); let strReturn;

    let intCount = 0;
    intCount = await count(genericArrayInput);
    let intI = 0;
    intI = 0;
    let strOut = '';
    while (await implLt(intI, intCount)) {
        strOut = await implCat(strOut, await strFrom(await get(genericArrayInput, intI)));
        intI = await implAdd(intI, 1);
    }

    strReturn = strOut; await assertIsStr(strReturn); return strReturn;
}

// @license-end
