/* logging, provides:
    implDie
    implWarn
    implLog
    implDebug
    setDebugLevel
    FIXMEUnimplemented
*/

var STAGEL_DEBUG;
if (STAGEL_DEBUG === undefined) {
    STAGEL_DEBUG = 3;
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
    if(Object.keys(stagelDebugCallstack).length > 0) {
        console.log("(Trace for prev. message: " + await internalDebugPrintStack() + ")");
    }
}

async function implDebug(strMessage, intLevel) {
    await assertIsStr(strMessage); await assertIsInt(intLevel);
    // Log the provided message

    if (intLevel <= STAGEL_DEBUG) {
        await implLog(strMessage);
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

// Internal functions

async function internalDebugCollect(strMessageFragment) {
    stagelDebugCollection = stagelDebugCollection + strMessageFragment;
}

async function internalDebugFlush() {
    console.log("Flushing debug message fragment collector, which contains: " + stagelDebugCollection);
    let temp;
    temp = stagelDebugCollection;
    stagelDebugCollection = "";
    return temp;
}

async function internalDebugStackEnter(strBlockName) {
    console.log("Stackoooooo");
    await implDebug("Entered block parameter list: " + strBlockName, 3);
    await stagelDebugCallstack.push(strBlockName);
}

async function internalDebugStackEnterEnd(strBlockName) {
    if (strBlockName === undefined) {
        implDie("Block name not given when calling internalDebugStackEnterEnd")
    }
    await implDebug("Entered block: " + strBlockName + " (" + await internalDebugFlush() + ")", 2);
    await stagelDebugCallstack.push(strBlockName);
}

async function internalDebugStackExit() {
    if (stagelDebugCallstack[-1] === undefined) {
        implDie("Exited block, but no block on stack");
    }
    await implDebug("Exited block: " + await stagelDebugCallstack.pop(), 3);
}

async function internalDebugPrintStack() {
    let i=0;
    let count;
    count = Object.keys(stagelDebugCallstack).length;
    console.log(stagelDebugCallstack);
    let result="";
    while (i<count) {
        /* FIXME: This could probably be optimized if it's problematically slow. */
        result = result + stagelDebugCallstack[i] + " ";
        i = i + 1;
    }
    return result;
}
