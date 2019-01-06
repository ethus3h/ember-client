/* logging, provides:
    implDie
    implWarn
    implLog
    implFIXMEUnimplemented
*/

async function implDie(strMessage) {
    // Don't call await assertIsStr(strMessage); here since it can call implDie and cause a recursive loop

    throw strMessage;
}

async function implWarn(strMessage) {
    await assertIsStr(strMessage);
    // Log the provided message

    await implFIXMEUnimplemented("implWarn");

    console.log(await implStrNormalizeMessage(strMessage));
}

async function implLog(strMessage) {
    await assertIsStr(strMessage);
    // Log the provided message

    console.log(await implStrNormalizeMessage(strMessage));
}

async function implFIXMEUnimplemented(strLocation) {
    await assertIsStr(strLocation);

    await implLog("FIXME: Unimplemented in " + strLocation);
}
