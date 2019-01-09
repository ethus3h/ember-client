/* bits, provides:
    bitAnd
    bitNot
*/

// Note that bitwise operations in StageL operate on bytes rather than ints. Consequently, C-style bitwise operations must be emulated for the Javascript implementation.

async function bitAnd(byteA, byteB) {
    assertIsByte(byteA); assertIsByte(byteB); let byteReturn;

    byteReturn = await internalBitwiseMask(byteA & byteB);
    await assertIsByte(byteReturn); return byteReturn;
}

async function bitNot(byteA) {
    assertIsByte(byteA); let byteReturn;

    byteReturn = await internalBitwiseMask(~byteA);
    await assertIsByte(byteReturn); return byteReturn;
}

async function internalBitwiseMask(uint32input) {
    let byteReturn;
    let byteMask;
    byteMask = 255;
    byteReturn = byteReturn & byteMask; /* zero out all but the least significant bits, which are what we want */
    return byteReturn;
}
