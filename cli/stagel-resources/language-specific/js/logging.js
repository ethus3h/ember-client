/* logging, provides:
    implDie
    implWarn
    implLog
    FIXMEUnimplemented
*/

var STAGEL_DEBUG;
if (STAGEL_DEBUG === undefined) {
    STAGEL_DEBUG = 0;
}
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

    await implLog(strMessage);
}

async function implLog(strMessage) {
    await assertIsStr(strMessage);
    // Log the provided message

    console.log(strMessage);
    console.log("(Trace for prev. message: " + await internalDebugFlush() + ")");
}

async function implDebug(strMessage, intLevel) {
    await assertIsStr(strMessage); await assertIsInt(intLevel);
    // Log the provided message

    if (intLevel <= STAGEL_DEBUG) {
        await implLog(strMessage);
    }
}

async function internalDebugCollect(strMessageFragment) {
    stagelDebugCollection = stagelDebugCollection + strMessageFragment;
}

async function internalDebugFlush(strMessageFragment) {
    await implDebug("Flushing debug message fragment collector, which contains: " + strMessageFragment, 3);
    return stagelDebugCollection;
    stagelDebugCollection = "";
}

async function internalDebugStackEnter(strBlockName) {
    await implDebug("Entered block: " + strBlockName, 3);
    await stagelDebugCallstack.push(strBlockName);
}

async function internalDebugStackEnterEnd(strBlockName) {
    await implDebug("Entered block: " + strBlockName + " (" + await internalDebugFlush() + ")", 2);
    await stagelDebugCallstack.push(strBlockName);
}

async function internalDebugStackExit() {
    await implDebug("Exited block: " + await stagelDebugCallstack.pop(), 3);
}

async function internalDebugPrintStack() {
    let i=0;
    let count;
    count = Object.keys(stagelDebugCallstack).length;
    while (i<count) {
        await internalDebugCollect(stagelDebugCallstack[i] + " ");
        i = i + 1;
    }
}

async function setDebugLevel(intLevel) {
    await assertIsInt(intLevel);
    // Set the debug level to the level specified. Int from 0 to 2 inclusive. Default 0. 0 = no debug messages printed; 1 = normal debug messages printed; 2 = block entry printed; 3 = verbose printing

    STAGEL_DEBUG=intLevel;
}

async function FIXMEUnimplemented(strLocation) {
    await assertIsStr(strLocation);

    await implLog("FIXME: Unimplemented in " + strLocation);
}
