/* bits, provides:
    implBitAnd
    implBitNot
*/

async function implBitAnd(byteA, byteB) {
    assertIsByte(byteA); assertIsByte(byteB); let byteReturn;

    byteReturn = byteA && byteB; await assertIsByte(byteReturn); return byteReturn;
}

async function implBitNot(boolA) {
    assertIsBool(boolA); let boolReturn;

    boolReturn = !boolA; await assertIsBool(boolReturn); return boolReturn;
}
