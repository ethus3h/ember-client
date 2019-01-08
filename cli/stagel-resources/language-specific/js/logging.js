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

    /* console.log(strMessage);
    console.log(stagelDebugCallstack); */
    if(await Object.keys(stagelDebugCallstack).length > 0) {
        await console.log("(Trace for prev. message: " + await internalDebugPrintStack() + ")");
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
    /* console.log("Flushing debug message fragment collector, which contains: " + stagelDebugCollection); */
    let temp;
    temp = stagelDebugCollection;
    stagelDebugCollection = "";
    return temp;
}

async function internalDebugStackEnter(strBlockName) {
    await implDebug("Entered block parameter list: " + strBlockName, 3);
    if (strBlockName === undefined) {
        await implDie("Block entry specified but no block name given");
    }
    await stagelDebugCallstack.push(strBlockName);
}

async function internalDebugStackEnterEnd() {
    await implDebug("Entered block: " + await stagelDebugCallstack.slice(-1)[0] + " (" + await internalDebugFlush() + ")", 2);
}

async function internalDebugStackExit() {
    if (stagelDebugCallstack.slice(-1)[0] === undefined) {
        await implDie("Exited block, but no block on stack");
    }
    await implDebug("Exited block: " + await stagelDebugCallstack.pop(), 3);
}

async function internalDebugPrintStack() {
    let i=0;
    let count;
    count = await Object.keys(stagelDebugCallstack).length;
    let result="";
    while (i<count) {
        /* FIXME: This could probably be optimized if it's problematically slow. */
        result = result + stagelDebugCallstack[i] + " ";
        i = i + 1;
    }
    return result;
}
