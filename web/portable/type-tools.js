// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Depends:
    implIntBytearrayLength
    implIntDcarrLength
*/

async function intBytearrayLength(bytearray) {
    let intReturn;
    intReturn = await implIntBytearrayLength(bytearray); await assertIsInt(intReturn); return intReturn;
}

async function intDcarrLength(dcarr) {
    let intReturn;
    intReturn = await implIntDcarrLength(dcarr); await assertIsInt(intReturn); return intReturn;
}

// @license-end
