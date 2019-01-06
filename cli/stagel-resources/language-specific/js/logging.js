/* logging, provides:
    die
    warn
    log
    FIXMEUnimplemented
*/

async function die(strMessage) {
    // Don't call await assertIsStr(strMessage); here since it can call implDie and cause a recursive loop

    throw strMessage;
}

async function warn(strMessage) {
    await assertIsStr(strMessage);
    // Log the provided message

    await FIXMEUnimplemented("implWarn");

    console.log(strMessage);
}

async function log(strMessage) {
    await assertIsStr(strMessage);
    // Log the provided message

    console.log(strMessage);
}

async function FIXMEUnimplemented(strLocation) {
    await assertIsStr(strLocation);

    await log("FIXME: Unimplemented in " + strLocation);
}
