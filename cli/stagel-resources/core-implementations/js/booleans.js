/* booleans, provides:
    implAnd
    implNot
*/

async function implAnd(boolA, boolB) {
    assertIsBool(boolA); assertIsBool(boolB); let boolReturn;

    boolReturn = boolA && boolB; await assertIsBool(boolReturn); return boolReturn;
}

async function implNot(boolA) {
    assertIsBool(boolA); let boolReturn;

    boolReturn = !boolA; await assertIsBool(boolReturn); return boolReturn;
}
