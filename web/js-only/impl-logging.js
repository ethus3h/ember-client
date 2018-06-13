// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
/* Provides:
    implDie
    implEiteLog
    implEiteFIXMEUnimplemented
*/

async function implDie(strMessage) {
    // Don't call await assertIsStr(strMessage); since it can call implDie and cause a recursive loop

    throw strMessage;
}

async function implEiteLog(strMessage) {
    await assertIsStr(strMessage);
    // Log the provided message

    console.log(await implStrNormalizeMessage(strMessage));
};

async function implEiteFIXMEUnimplemented(strLocation) {
    await assertIsStr(strLocation);

    await eiteLog("FIXME: Unimplemented in " + strLocation);
}

// @license-end
