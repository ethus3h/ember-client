/* logging, provides:
    implDie
    implWarn
    implLog
    implDebug
    setDebugLevel
    FIXMEUnimplemented
*/

async function implDie(strMessage) {
    // Don't call await assertIsStr(strMessage); here since it can call implDie and cause a recursive loop

    await implError(strMessage);

    throw strMessage;
}

async function implError(strMessage) {
    if(typeof strMessage !== "string") {
        throw "Nonstring error message";
    }
    // Don't call await assertIsStr(strMessage); here since it can call implDie and cause a recursive loop — maybe??

    //await FIXMEUnimplemented("implError");
    await implWarn(strMessage);
}

async function implWarn(strMessage) {
    if(typeof strMessage !== "string") {
        throw "Nonstring error message";
    }
    await assertIsStr(strMessage);
    // Log the provided message

    await FIXMEUnimplemented("implWarn");

    await implLog(strMessage);
}

async function implLog(strMessage) {
    if (getWindowOrSelf()['internalDelegateStateRequests'] === true) {
        await eiteHostCall('implLog', [strMessage]);
    }
    else {
        if(typeof strMessage !== "string") {
            throw "Nonstring error message";
        }
        await assertIsStr(strMessage);
        // Log the provided message
        await console.log(strMessage);
        let temp=await getSharedState('stagelDebugCallstack');
        if(temp !== undefined) {
            if(await Object.keys(temp).length > 0) {
                await console.log("Previous message sent at: " + await internalDebugPrintStack());
            }
            else {
                // use getWindowOrSelf instead of getSharedState to avoid recursion
                if (2 <= getWindowOrSelf()['STAGEL_DEBUG']) {
                    await console.log("(Previous message sent from non-StageL code.)");
                }
            }
        }
        else {
            console.log('Warning: implLog called before EITE finished setting up. Log message is: '+strMessage);
        }
    }
}
async function implDebug(strMessage, intLevel) {
    if(typeof strMessage !== "string") {
        throw "Nonstring error message";
    }
    if ((! Number.isInteger(intLevel)) || typeof intLevel === "undefined" || intLevel === null || intLevel < -2147483648 || intLevel > 2147483647) {
        throw "Non-integer debug level";
    }
    await assertIsStr(strMessage); await assertIsInt(intLevel);
    // Log the provided message

    // use getWindowOrSelf instead of getSharedState to avoid recursion
    if (intLevel <= getWindowOrSelf()['STAGEL_DEBUG']) {
        await implLog(strMessage);
    }
}

async function setDebugLevel(intLevel) {
    await assertIsInt(intLevel);
    // Set the debug level to the level specified. Int from 0 to 2 inclusive. Default 0. 0 = no debug messages printed; 1 = normal debug messages printed; 2 = block entry printed; 3 = verbose printing

    await setSharedState('STAGEL_DEBUG', intLevel);
}

async function FIXMEUnimplemented(strLocation) {
    await assertIsStr(strLocation);

    await implLog("FIXME: Unimplemented in " + strLocation);
}

// Internal functions

async function internalDebugQuiet(strMessage, intLevel) {
    await assertIsStr(strMessage); await assertIsInt(intLevel);
    // Log the provided message, but don't print a trace for it

    if (intLevel <= await getSharedState('STAGEL_DEBUG')) {
        // await implLog(strMessage);
        console.log(strMessage);
    }
}

async function internalDebugCollect(strMessageFragment) {
    await setSharedState('stagelDebugCollection', await getSharedState('stagelDebugCollection') + strMessageFragment);
}

async function internalDebugFlush() {
    /* console.log("Flushing debug message fragment collector, which contains: " + stagelDebugCollection); */
    let temp;
    temp = await getSharedState('stagelDebugCollection');
    await setSharedState('stagelDebugCollection', "");
    return temp;
}

async function internalDebugStackEnter(strBlockName) {
    if (strBlockName === undefined) {
        await implDie("Block entry specified but no block name given");
    }

    let tempCounts;

    if (await getSharedState('stagelDebugCallNames').indexOf(strBlockName) < 0) {
        let tempNames;
        tempNames=await getSharedState('stagelDebugCallNames');
        tempNames.push(strBlockName);
        await setSharedState('stagelDebugCallNames', tempNames);
        tempCounts=await getSharedState('stagelDebugCallCounts');
        tempCounts[await getSharedState('stagelDebugCallNames').indexOf(strBlockName)] = 0;
        await setSharedState('stagelDebugCallCounts', tempCounts);
    }

    let ind;
    ind = await getSharedState('stagelDebugCallNames').indexOf(strBlockName);
    tempCounts=await getSharedState('stagelDebugCallCounts');
    tempCounts[ind] = tempCounts[ind] + 1;
    await setSharedState('stagelDebugCallCounts', tempCounts);

    let temp;
    temp=await getSharedState('stagelDebugCallstack');
    temp.push(strBlockName + " (" + await internalDebugFlush() + ")");
    await setSharedState('stagelDebugCallstack', temp);

    if (2 <= await getSharedState('STAGEL_DEBUG')) {
        let callstackLevel=stagelDebugCallstack.length;
        let callstackLevelStr='';
        let i=0;
        while (i<callstackLevel) {
            if (i%4 === 0) {
                callstackLevelStr=callstackLevelStr+'|';
            }
            else {
                callstackLevelStr=callstackLevelStr+':';
            }
            i=i+1;
        }
        //let callstackLevelStr=":".repeat(callstackLevel);
        await internalDebugQuiet(callstackLevelStr+"Entered block: " + await getSharedState('stagelDebugCallstack').slice(-1)[0], 2);
    }
}

async function internalDebugStackExit() {
    //alert("Dbgstackext");
    if (await await getSharedState('stagelDebugCallstack').slice(-1)[0] === undefined) {
        await implDie("Exited block, but no block on stack");
    }
    let temp;
    temp=await getSharedState('stagelDebugCallstack');
    await internalDebugQuiet("Exited block: " + await temp.pop(), 3);
    await setSharedState('stagelDebugCallstack', temp);
}

async function internalDebugPrintHotspots() {
    let n = 0;
    n = await getSharedState('stagelDebugCallNames').length;
    let i = 0;
    if (n === 0) {
        console.log('No routine calls have been logged.');
    }
    while (i < n){
        console.log(await getSharedState('stagelDebugCallNames')[i] + ' was called ' + await getSharedState('stagelDebugCallCounts')[i] + ' times.');
        i = i + 1;
    }
    let sum = 0;
    sum = await getSharedState('stagelDebugCallCounts').reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
    }, 0);
    console.log('Total function calls: ' + sum);
}

async function internalDebugPrintStack() {
    let i;
    i = await Object.keys(await getSharedState('stagelDebugCallstack')).length - 1;
    let result="";
    let arrow=" < "
    while (i>=0) {
        /* FIXME: This could probably be optimized if it's problematically slow. */
        if (i==0) {
            arrow=""
        }
        result = result + await getSharedState('stagelDebugCallstack').slice(i)[0] + arrow;
        i = i - 1;
    }
    return result;
}

async function internalDebugLogJSObject(obj) {
    if (1 <= await getSharedState('STAGEL_DEBUG')) {
        console.log(obj);
    }
}
