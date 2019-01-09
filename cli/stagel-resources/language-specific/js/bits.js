/* bits, provides:
    bitAnd
    bitNot
*/

async function bitAnd(byteA, byteB) {
    assertIsByte(byteA); assertIsByte(byteB); let byteReturn;
    // Note that bitwise operations in StageL operate on bytes rather than ints. Consequently, C-style bitwise operations must be emulated for the Javascript implementation.

    byteReturn = byteA & byteB;
    let byteMask;
    byteMask = 255;
    byteReturn = byteReturn & byteMask; /* zero out all but the least significant bits, which are what we want */
    await assertIsByte(byteReturn); return byteReturn;
}

async function bitNot(byteA) {
    assertIsByte(byteA); let byteReturn;
    // Note that bitwise operations in StageL operate on bytes rather than ints. Consequently, C-style bitwise operations must be emulated for the Javascript implementation.

    byteReturn = ~byteA;
    let byteMask;
    byteMask = 255;
    byteReturn = byteReturn & byteMask; /* zero out all but the least significant bits, which are what we want */
    await assertIsByte(byteReturn); return byteReturn;
}
