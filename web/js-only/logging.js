// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Depends:
    implDie
    implEiteLog
*/

async function implEiteLog(strMessage) {
    // This function implements logging (which may differ between platforms).
    console.log(implStrNormalizeMessage(strMessage));
};
