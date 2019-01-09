/* bits, provides:
    bitAnd
    bitNot
*/

// Note that bitwise operations in StageL operate on bytes rather than uint32s. Consequently, C-style 8-bit bitwise operations must be emulated for the Javascript implementation.

async function bitAnd(byteA, byteB) {
    await assertIsByte(byteA); await assertIsByte(byteB); let byteReturn;

    byteReturn = await internalBitwiseMask(byteA & byteB);

    await assertIsByte(byteReturn); return byteReturn;
}

async function bitNot(byteA) {
    await assertIsByte(byteA); let byteReturn;

    byteReturn = await internalBitwiseMask(~byteA);
    await assertIsByte(byteReturn); return byteReturn;
}

async function bitLshift(byteA, intPlaces) {
    await assertIsByte(byteA); await assertIsInt(intPlaces); let byteReturn;

    await assertIsBetween(intPlaces, 0, 31);

    byteReturn = await internalBitwiseMask(byteA << intPlaces);

    await assertIsByte(byteReturn); return byteReturn;
}

async function bitRshift(byteA, intPlaces) {
    await assertIsByte(byteA); await assertIsInt(intPlaces); let byteReturn;

    await assertIsBetween(intPlaces, 0, 31);

    byteReturn = await internalBitwiseMask(byteA >>> intPlaces);

    await assertIsByte(byteReturn); return byteReturn;
}

// Internal function

async function internalBitwiseMask(uint32input) {
    let byteReturn;
    let byteMask;
    byteMask = 255;
    byteReturn = byteReturn & byteMask; /* zero out all but the least significant bits, which are what we want */
    return byteReturn;
}
