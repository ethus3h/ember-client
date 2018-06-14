// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Depends:
    implNewDcarr
    implDcCustomTypeDcarrDcAtPos
    implVoidCustomTypeDcarrPut
    implVoidCustomTypeDcarrPush
*/

async function newDcarr() {
    let dcarrReturn;

    dcarrReturn = await implNewDcarr(); await assertIsDcarr(dcarrReturn); return dcarrReturn;
}

async function dcCustomTypeDcarrDcAtPos(dcarr, intIndex) {
    await assertIsDcarr(dcarr); await assertIsInt(intIndex); let dcReturn;

    dcReturn = await implDcCustomTypeDcarrDcAtPos(dcarr, intIndex); await assertIsDc(dcReturn); return dcReturn;
}

async function customTypeDcarrPut(dcarr, intIndex, dcToAdd) {
    await assertIsDcarr(dcarr); await assertIsInt(intIndex); await assertIsDc(dcToAdd);

    await implVoidCustomTypeDcarrPut(dcarr, dcToAdd);
}

async function customTypeDcarrPush(dcarr, dcToAdd) {
    await assertIsDcarr(await dcarr); await assertIsDc(dcToAdd);

    await implVoidCustomTypeDcarrPush(await dcarr, dcToAdd);
}

// @license-end
