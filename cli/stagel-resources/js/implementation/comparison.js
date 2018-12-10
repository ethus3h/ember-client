/* comparison.js, provides:
    implEq
    implGt
    implLt
*/

async function implEq(genericA, genericB) {
    await assertIsGeneric(genericA); await assertIsGeneric(genericB); let boolReturn;

    boolReturn = genericA == genericB; await assertIsBool(boolReturn); return boolReturn;
}

async function implGt(genericA, genericB) {
    await assertIsGeneric(genericA); await assertIsGeneric(genericB); let boolReturn;

    boolReturn = genericA > genericB; await assertIsBool(boolReturn); return boolReturn;
}

async function implLt(genericA, genericB) {
    await assertIsGeneric(genericA); await assertIsGeneric(genericB); let boolReturn;

    boolReturn = genericA < genericB; await assertIsBool(boolReturn); return boolReturn;
}
