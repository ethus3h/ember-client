// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Depends:
    implNewDcarr
    implCustomTypeDcarrValueAtPos
    implCustomTypeDcarrPush
*/

async function newDcarr() {
    let dcarrReturn;

    dcarrReturn = implNewDcarr(); await assertIsDcarr(dcarrReturn); return dcarrReturn;
}

async function customTypeDcarrValueAtPos(dcarr, intIndex) {
    await assertIsDcarr(dcarr); await assertIsInt(intIndex);

    await implCustomTypeDcarrValueAtPos(dcarr, intIndex);
}

async function customTypeDcarrPush(dcarr, dcToAdd) {
    await assertIsDcarr(dcarr); await assertIsDc(dcToAdd);

    await implCustomTypeDcarrPush(dcarr, dcToAdd);
}

// @license-end
