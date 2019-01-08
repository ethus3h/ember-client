/* logging, provides:
    implDie
    implWarn
    implLog
    FIXMEUnimplemented
*/

var STAGEL_DEBUG;
let stagelDebugCallstack = [];
let stagelDebugCollection = "";

async function implDie(strMessage) {
    // Don't call await assertIsStr(strMessage); here since it can call implDie and cause a recursive loop

    await implWarn(strMessage);

    throw strMessage;
}

async function implWarn(strMessage) {
    await assertIsStr(strMessage);
    // Log the provided message

    await FIXMEUnimplemented("implWarn");

    implLog(strMessage);
}

async function implLog(strMessage) {
    await assertIsStr(strMessage);
    // Log the provided message

    console.log(strMessage);
}

async function implDebugCollect(strMessageFragment) {
    stagelDebugCollection = stagelDebugCollection + strMessageFragment;
}

async function implDebugFlush(strMessageFragment) {
    implDebug("Flushing debug message fragment collector, which contains: " + strMessageFragment, 2);
    stagelDebugCollection = "";
}

async function implDebugStackEnter(strBlockName) {
    implDebug("Entered block: " + strBlockName, 2);
    stagelDebugCallstack.push(strBlockName);
}

async function implDebugStackExit() {
    implDebug("Exited block: " + stagelDebugCallstack.pop(), 2);
}

async function implDebug(strMessage, intLevel) {
    await assertIsStr(strMessage); await assertIsInt(intLevel);
    // Log the provided message

    if (intLevel <= STAGEL_DEBUG) {
        implLog(strMessage);
    }

    console.log(strMessage, intLevel);
}

async function setDebugLevel(intLevel) {
    await assertIsInt(intLevel);
    // Set the debug level to the level specified. Int from 0 to 2 inclusive. Default 0. 0 = no debug messages printed; 1 = normal debug messages printed; 2 = verbose printing

    STAGEL_DEBUG=intLevel;

    console.log(strMessage);
}

async function FIXMEUnimplemented(strLocation) {
    await assertIsStr(strLocation);

    await implLog("FIXME: Unimplemented in " + strLocation);
}
