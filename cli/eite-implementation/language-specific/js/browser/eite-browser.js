// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
// This file defines functions with implementations that are specific to Web browser implementation of EITE in JavaScript.
// This is a library file, and should only initialize functions/variables, so that it can be loaded and run in parallel with other library files, and work regardless of the order they are loaded.

// Fully platform-specific code

async function renderDrawContents(renderBuffer) {
    // Whether it appends or replaces the frame would depend on the environment.
    if(haveDom) {
        
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
            await implError("Unimplemented test format: " + strTestFormat);
            break;
    }
}

// @license-end
