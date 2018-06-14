// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Provides:
    implNewDcarr
    implCustomTypeDcarrDcAtPos
    implCustomTypeDcarrPush
*/

Dcarrs = [];

async function implNewDcarr() {
    let dcarrReturn;

    Dcarrs[Dcarrs.length] = [];
    dcarrReturn = Dcarrs.length - 1; await assertIsDcarr(dcarrReturn); return dcarrReturn;
}

async function implCustomTypeDcarrDcAtPos(dcarr, intIndex) {
    await assertIsDcarr(dcarr); await assertIsInt(intIndex); let dcReturn;

    dcReturn = Dcarrs[dcarr][intIndex]; assertIsDc(dcReturn); return dcReturn;
}

async function implCustomTypeDcarrPush(dcarr, dcToAdd) {
    await assertIsDcarr(dcarr); await assertIsDc(dcToAdd);

    Dcarrs[await dcarr].push(dcToAdd);
}

// @license-end
