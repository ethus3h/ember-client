/* bits, provides:
    implBitAnd
    implBitNot
*/

async function implBitAnd(byteA, byteB) {
    assertIsByte(byteA); assertIsByte(byteB); let byteReturn;

    byteReturn = byteA && byteB; await assertIsByte(byteReturn); return byteReturn;
}

async function implBitNot(boolA) {
    assertIsByte(byteA); let byteReturn;

    byteReturn = !byteA; await assertIsByte(byteReturn); return byteReturn;
}
