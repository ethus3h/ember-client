/* comparison.js, provides:
    implEq
    implGt
    implLt
*/

async function implEq(a, b) {
    /* Can compare booleans, ints, or strings. */
    let boolReturn;

    boolReturn = a == b; await assertIsBool(boolReturn); return boolReturn;
}

async function implGt(a, b) {
    /* Can compare booleans or ints */
    let boolReturn;

    boolReturn = a > b; await assertIsBool(boolReturn); return boolReturn;
}

async function implLt(a, b) {
    /* Can compare booleans or ints */
    let boolReturn;

    boolReturn = a < b; await assertIsBool(boolReturn); return boolReturn;
}
