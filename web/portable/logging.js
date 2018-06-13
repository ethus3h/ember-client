// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Depends:
    implDie
    implEiteLog
    implEiteFIXMEUnimplemented
*/

async function die(strMessage) {
    await implDie(strMessage);
}

async function eiteLog(strMessage) {
    await assertIsStr(strMessage);
    await implEiteLog(strMessage);
}

async function eiteWarn(strMessage) {
    await assertIsStr(strMessage);
    await eiteLog('EITE reported warning: '+strMessages);
}

async function eiteError(strMessage) {
    await assertIsStr(strMessage); // FIXME: recursive loop?
    await eiteLog('EITE reported error!: '+strMessage);
    await die('EITE reported error!: '+strMessage);
}

async function eiteFIXMEUnimplemented() {
    await implEiteFIXMEUnimplemented();
}

// @license-end
