/* bits, provides:
    bitAnd
    bitNot
*/

async function bitAnd(byteA, byteB) {
    assertIsByte(byteA); assertIsByte(byteB); let byteReturn;
    // Note that bitwise operations in StageL operate on bytes rather than ints. Consequently, C-style bitwise operations must be emulated for the Javascript implementation.

    byteReturn = byteA && byteB; await assertIsByte(byteReturn); return byteReturn;
}

async function bitNot(boolA) {
    assertIsByte(byteA); let byteReturn;
    // Note that bitwise operations in StageL operate on bytes rather than ints. Consequently, C-style bitwise operations must be emulated for the Javascript implementation.

    byteReturn = !byteA; await assertIsByte(byteReturn); return byteReturn;
}
