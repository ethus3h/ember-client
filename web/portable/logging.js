async function eiteLog(strMessage) {
    await assertIsStr(strMessage);
    return await implEiteLog(strMessage);
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
