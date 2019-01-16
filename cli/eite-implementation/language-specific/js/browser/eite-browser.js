// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
// This file defines functions with implementations that are specific to Web browser implementation of EITE in JavaScript.
// This is a library file, and should only initialize functions/variables, so that it can be loaded and run in parallel with other library files, and work regardless of the order they are loaded.

// Override error reporting method to show alert
// TODO: Does this always work? Overrides aren't really possible when it's load-order-independent, I wouldn't think...
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

    await console.trace();
    alert("EITE reported error!: " + strMessage);
}

async function implWarn(strMessage) {
    await assertIsStr(strMessage);
    // Log the provided message

    await FIXMEUnimplemented("implWarn");
    await implLog(strMessage);

    await console.trace();
}

async function implLog(strMessage) {
    await assertIsStr(strMessage);
    // Log the provided message

    await console.log(strMessage);
    //await console.trace();
    if(await Object.keys(stagelDebugCallstack).length > 0) {
        await console.log("Previous message sent at: " + await internalDebugPrintStack());
    }
    else {
        if (2 <= STAGEL_DEBUG && 3 > STAGEL_DEBUG) {
            await console.log("(Previous message sent from non-StageL code.)");
            await console.trace();
        }
    }
    if (3 <= STAGEL_DEBUG) {
        await console.trace();
    }
}

// Fully platform-specific code

async function implGetEnvironmentBestFormat() {
    return "HTML";
    /* return "immutableCharacterCells"; */
}

async function implGetEnvironmentRenderTraits(targetFormat) {
    if ( targetFormat === undefined ) {
        await eiteError("implGetEnvironmentRenderTraits was called without any targetFormat!");
    }
    var traits = {};
    let cs = document.characterSet.toLowerCase();
    switch (targetFormat) {
        case "HTML":
            switch(cs) {
                case "utf-8":
                    traits.characterEncoding = "UTF-8";
                    break;
                default:
                    await implWarn("Unimplemented character set: " + cs + ". Falling back to ASCII-safe-subset.");
                    traits.characterEncoding = "ASCII-safe-subset";
                    break;
            }
            break;
        case "integerList":
        case "immutableCharacterCells":
            traits.cellTableWidth = -1; // unlimited
            traits.cellTableHeight = -1; // unlimited
            switch(cs) {
                case "utf-8":
                    traits.characterEncoding = "UTF-8";
                    break;
                default:
                    await implWarn("Unimplemented character set: " + cs + ". Falling back to ASCII-safe-subset.");
                    traits.characterEncoding = "ASCII-safe-subset";
                    break;
            }
            break;
    }
    return traits;
}

async function implDoRenderIo(renderBuffer, targetFormat) {
    switch (targetFormat) {
        case "integerList":
        case "immutableCharacterCells":
            let immutableCharCellOutput = await document.getElementById("eiteDocumentRoot");
            for (let i = 0; i < renderBuffer.length; i++) {
                immutableCharCellOutput.innerHTML += renderBuffer[i] + "<br />";
                immutableCharCellOutput.scrollTop = immutableCharCellOutput.scrollHeight;
            }
            break;
        case "HTML":
            /* Should we return a new tree on every content change, or return a series of transformations in some manner? For now, just dump out the document, since we don't have update ticks implemented yet. */
            /* This shouldn't actually do I/O; that should be handled somewhere else I think. This function (implDoRenderIo) is currently handling both doc rendering and I/O. TODO: Split them. */
           let htmlOutputRootElement = await document.getElementById("eiteDocumentRoot");
            let strOutputHtml = "";
            for (let i = 0; i < renderBuffer.length; i++) {
                if (await dcIsPrintable(renderBuffer[i]) || await dcIsNewline(renderBuffer[i]) || await dcIsSpace(renderBuffer[i])) {
                    strOutputHtml = strOutputHtml + await printableDcToChar(renderBuffer[i], "HTML");
                }
            }
            htmlOutputRootElement.innerHTML += strOutputHtml;
            htmlOutputRootElement.scrollTop = htmlOutputRootElement.scrollHeight;
            break;
        default:
            await eiteError("Unimplemented render I/O format: " + targetFormat);
            break;
    }
}

async function implRunEiteTest(strTestFormat, strTestName) {
    // TODO: Unfinished implementation
    strTestUrlPrefix="../tests/" + strTestName + "." + strTestFormat + "/";
    strTestInputFormatUrl="../tests/" + strTestName + "." + strTestFormat + "/in-format";
    switch (strTestFormat) {
        case "ept": // Parser test
            await implUrlLoadForCallback(strTestInputFormatUrl, async function(bytearrayContent) {});
            break;
        default:
            await eiteError("Unimplemented test format: " + strTestFormat);
            break;
    }
}

// @license-end
