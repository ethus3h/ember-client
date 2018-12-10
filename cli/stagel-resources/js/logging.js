/* logging, provides:
    implDie
    implEiteLog
    implEiteFIXMEUnimplemented
*/

async function implDie(strMessage) {
    // Don't call await assertIsStr(strMessage); here since it can call implDie and cause a recursive loop

    throw strMessage;
}

async function implEiteLog(strMessage) {
    await assertIsStr(strMessage);
    // Log the provided message

    console.log(await implStrNormalizeMessage(strMessage));
}

async function implEiteFIXMEUnimplemented(strLocation) {
    await assertIsStr(strLocation);

    await eiteLog("FIXME: Unimplemented in " + strLocation);
}

// @license-end
