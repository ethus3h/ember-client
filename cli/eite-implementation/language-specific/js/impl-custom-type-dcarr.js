// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Provides:
    implNewDcarr
    implDcCustomTypeDcarrDcAtPos
    implVoidCustomTypeDcarrPut
    implVoidCustomTypeDcarrPush
*/

Dcarrs = [];

async function implNewDcarr() {
    let dcarrReturn;

    Dcarrs[Dcarrs.length] = [];
    dcarrReturn = Dcarrs.length - 1; await assertIsDcArray(dcarrReturn); return dcarrReturn;
}

async function implDcCustomTypeDcarrDcAtPos(dcarr, intIndex) {
    await assertIsDcArray(dcarr); await assertIsInt(intIndex); let dcReturn;

    dcReturn = Dcarrs[await dcarr][intIndex]; await assertIsDc(dcReturn); return dcReturn;
}

async function implVoidCustomTypeDcarrPut(dcarr, intIndex, dcToAdd) {
    await assertIsDcArray(dcarr); await assertIsInt(intIndex); await assertIsDc(dcToAdd);

    Dcarrs[await dcarr][intIndex] = dcToAdd;
}

async function implVoidCustomTypeDcarrPush(dcarr, dcToAdd) {
    await assertIsDcArray(dcarr); await assertIsDc(dcToAdd);

    await Dcarrs[await dcarr].push(dcToAdd);
}

// @license-end
