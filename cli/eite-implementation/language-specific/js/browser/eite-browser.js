// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
// This file defines functions with implementations that are specific to Web browser implementation of EITE in JavaScript.
// This is a library file, and should only initialize functions/variables, so that it can be loaded and run in parallel with other library files, and work regardless of the order they are loaded.

// Override error reporting method to show alert
// TODO: Does this always work? Overrides aren't really possible when it's load-order-independent, I wouldn't think...
async function implError(strMessage) {
    // Don't call await assertIsStr(strMessage); here since it can call implDie and cause a recursive loop

    await implWarn(strMessage);

    console.trace();
    alert("EITE reported error!: " + strMessage);

    throw strMessage;
}
async function implWarn(strMessage) {
    await assertIsStr(strMessage);
    // Log the provided message

    await FIXMEUnimplemented("implWarn");

    console.log(strMessage);

    console.trace();
    alert("EITE reported warning: " + strMessage);
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

async function implLoadCsv(url, lineLoadedCallback, documentLoadedCallback, errorCallback) {
    await Papa.parse(url, {
        download: true,
        encoding: "UTF-8",
        newline: "\n",
        delimiter: ",",
        quoteChar: "\"",
        step: async function(results, parser) {
            await lineLoadedCallback(results, parser);
        },
        complete: async function(results, file) {
            await documentLoadedCallback(results, file);
        },
        error: async function(results, file) {
            await errorCallback(results, file);
        }
    });
}

async function implDoRenderIo(renderBuffer, targetFormat) {
    switch (targetFormat) {
        case "integerList":
        case "immutableCharacterCells":
            let immutableCharCellOutput = document.getElementById("eiteDocumentRoot");
            for (let i = 0; i < renderBuffer.length; i++) {
                immutableCharCellOutput.innerHTML += renderBuffer[i] + "<br />";
                immutableCharCellOutput.scrollTop = immutableCharCellOutput.scrollHeight;
            }
            break;
        case "HTML":
            /* Should we return a new tree on every content change, or return a series of transformations in some manner? For now, just dump out the document, since we don't have update ticks implemented yet. */
            /* This shouldn't actually do I/O; that should be handled somewhere else I think. This function (implDoRenderIo) is currently handling both doc rendering and I/O. TODO: Split them. */
            let htmlOutputRootElement = document.getElementById("eiteDocumentRoot");
            let strOutputHtml = "";
            for (let i = 0; i < renderBuffer.length; i++) {
                if (await boolDcIsPrintable(dcAtInputIndex) || await boolDcIsNewline(dcAtInputIndex) || await boolDcIsSpace(dcAtInputIndex)) {
                    strOutputHtml = strOutputHtml + await strPrintableDcToChar(renderBuffer[i], "HTML");
                }
            }
            immutableCharCellOutput.innerHTML += strOutputHtml;
            immutableCharCellOutput.scrollTop = immutableCharCellOutput.scrollHeight;
            strReturn = await strFromUnicodeHex(await strDcDataLookupByValue("mappings/from/unicode", 1, dc, 0));
            if (strReturn === "\u0000") {
                /* No mapping was found by reversing Unicode, so look for a simple character mapping from the HTML mappings */
                strReturn = await strDcDataLookupByValue("mappings/to/html", 0, dc, 1);
            }
            assertIsStr(strReturn); return strReturn;
            break;
        default:
            await eiteError("Unimplemented render I/O format: " + targetFormat);
            break;
    }
}

async function implUrlLoadForCallback(url, callback) {
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.responseType = "arraybuffer";
    oReq.onload = async function(oEvent) {
        callback(new Uint8Array(oReq.response)); // Note: not oReq.responseText
    };
    oReq.send(null);
}

async function implOperateOnDocFromUrl(strFormat, strUrl, callback) {
    await implUrlLoadForCallback(strUrl, async function(bytearrayContent) { await callback(await dcarrParseDocument(strFormat, bytearrayContent)); });
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

// Set up dcData
dcData = [];
async function implDcDataAppendDataset(dataset) {
    dcData[dataset] = [];
}
async function implDcDataAppendLine(dataset, line) {
    dcData[dataset].push(line);
}
async function implLoadDatasets(callback) {
    if (datasets.length > 0) {
        let dataset = datasets[0];
        await implDcDataAppendDataset(dataset);
        await implLoadCsv(
            "../data/" + dataset + ".csv",
            async function(results,parser){
                await implDcDataAppendLine(dataset, results);
            },
            async function(){
                datasets.shift();
                await implLoadDatasets(callback);
            },
            async function(){
                await eiteError("Error reported while parsing "+dataset+"!");
            }
        );
    }
    else {
        await callback();
    }
}

datasets=[
    "DcData",
    "mappings/from/ascii",
    "mappings/from/unicode",
    "mappings/to/html"
];
// @license-end
