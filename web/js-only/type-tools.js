// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Provides:
    implIntBytearrayLength
    implIntDcarrLength
*/

async function implIntBytearrayLength(bytearrayInput) {
    let intReturn = bytearrayInput.byteLength;
    await assertIsInt(intReturn); return intReturn;
}

async function implIntDcarrLength(dcarrInput) {
    let intReturn = dcarrInput.length;
    await assertIsInt(intReturn); return intReturn;
}

// @license-end
