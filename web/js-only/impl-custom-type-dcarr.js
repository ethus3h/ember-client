// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Provides:
    implNewDcarr
    implCustomTypeDcarrPush
*/

Dcarrs = [];

async function implNewDcarr() {
    let dcarrReturn;

    Dcarrs[Dcarrs.length] = [];
    dcarrReturn = Dcarrs.length; await assertIsDcarr(dcarrReturn); return dcarrReturn;
}

async function implCustomTypeDcarrPush(dcarr, dcToAdd) {
    await assertIsDcarr(dcarr); await assertIsDc(dcToAdd);

    Dcarrs[dcarr].push(dcToAdd);
}

// @license-end
