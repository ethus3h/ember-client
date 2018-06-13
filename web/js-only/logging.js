// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Provides:
    implDie
    implEiteLog
*/

async function implDie(strMessage) {
    throw strMessage;
}

async function implEiteLog(strMessage) {
    // Log the provided message
    await assertIsStr(strMessage);
    console.log(await implStrNormalizeMessage(strMessage));
};

// @license-end
