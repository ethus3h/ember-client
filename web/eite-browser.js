// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
// This file defines functions with implementations that are specific to Web browser implementation of EITE in JavaScript.
// This is a library file, and should only initialize functions/variables, so that it can be loaded and run in parallel with other library files, and work regardless of the order they are loaded.

// Platform-specific overrides of routines available portably

// Override error reporting method to show alert
// TODO: How to make this work? Overrides aren't really possible when it's load-order-independent, afaict...
async function eiteError(strMessage) {
    console.trace();
    await eiteLog('EITE reported error!: '+await implStrNormalizeMessage(strMessage));
    alert('EITE reported error!: '+await implStrNormalizeMessage(strMessage));
    throw 'EITE reported error!: '+await implStrNormalizeMessage(strMessage);
}
async function eiteWarn(strMessage) {
    console.trace();
    await eiteLog('EITE reported warning: '+await implStrNormalizeMessage(strMessage));
    alert('EITE reported warning: '+await implStrNormalizeMessage(strMessage));
}

// Fully platform-specific code

async function implEiteLog(strMessage) {
    // This function implements logging (which may differ between platforms).
    console.log(implStrNormalizeMessage(strMessage));
};

async function implGetEnvironmentBestFormat() {
    return 'immutableCharacterCells';
}

async function implGetEnvironmentRenderTraits(targetFormat) {
    if ( targetFormat === undefined ) {
        await eiteError('implGetEnvironmentRenderTraits was called without any targetFormat!');
    }
    var traits = {};
    switch (targetFormat) {
        case 'integerList':
        case 'immutableCharacterCells':
            traits.cellTableWidth = -1; // unlimited
            traits.cellTableHeight = -1; // unlimited
            let cs = document.characterSet.toLowerCase();
            switch(cs) {
                case 'utf-8':
                    traits.characterEncoding = 'UTF-8';
                    break;
                default:
                    await eiteWarn('Unimplemented character set: '+cs+'. Falling back to ASCII-safe-subset.');
                    traits.characterEncoding = 'ASCII-safe-subset';
                    break;
            }
            break;
    }
    return traits;
}

async function loadCsv(url, lineLoadedCallback, documentLoadedCallback, errorCallback) {
    await Papa.parse(url, {
        download: true,
        encoding: 'UTF-8',
        newline: "\n",
        delimiter: ',',
        quoteChar: '"',
        step: async function(results, parser) {
            await lineLoadedCallback(results, parser);
        },
        complete: async function(results, file) {
            await documentLoadedCallback(results, file);
        },
        error: async function(results, file) {
            await errorCallback(results, file);
        }
    })
}

async function implDoRenderIo(renderBuffer, targetFormat) {
    switch (targetFormat) {
        case 'integerList':
        case 'immutableCharacterCells':
            let immutableCharCellOutput = document.getElementById('log');
            for (let i = 0; i < renderBuffer.length; i++) {
                immutableCharCellOutput.innerHTML += await implStrNormalizeMessage(renderBuffer[i]) + '<br />';
                immutableCharCellOutput.scrollTop = immutableCharCellOutput.scrollHeight;
            }
            break;
        default:
            await eiteError('Unimplemented render I/O format: '+targetFormat);
            break;
    }
}

async function urlLoadForCallback(url, callback) {
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.responseType = "arraybuffer";
    oReq.onload = async function(oEvent) {
        callback(new Uint8Array(oReq.response)); // Note: not oReq.responseText
    };
    oReq.send(null);
}

async function operateOnDocFromUrl(strFormat, strUrl, callback) {
    await urlLoadForCallback(strUrl, async function(bytearrayContent) { await callback(await dcarrParseDocument(strFormat, bytearrayContent)); })
}

async function implStrFromByte(intInput) {
    return String.fromCharCode(intInput);
}

async function implStrFromUnicodeHex(strCharacter) {
    await assertIsStr(strCharacter);
    return String.fromCharCode('0x'+strCharacter);
}

async function runEiteTest(strTestFormat, strTestName) {
    // TODO: Unfinished implementation
    strTestUrlPrefix='../tests/'+strTestName+'.'+strTestFormat+'/';
    strTestInputFormatUrl='../tests/'+strTestName+'.'+strTestFormat+'/in-format';
    switch (strTestFormat) {
        case 'ept': // Parser test
            await urlLoadForCallback(strTestInputFormatUrl, async function(bytearrayContent) {})
            break;
        default:
            await eiteError('Unimplemented test format: '+strTestFormat);
            break;
    }
}

// Set up dcData
dcData = [];
async function dcDataAppendDataset(dataset) {
    dcData[dataset] = [];
}
async function dcDataAppendLine(dataset, line) {
    dcData[dataset].push(line);
}
async function loadDatasets(callback) {
    if (datasets.length > 0) {
        let dataset = datasets[0];
        await dcDataAppendDataset(dataset);
        await loadCsv(
            '../data/'+dataset+'.csv',
            async function(results,parser){
                await dcDataAppendLine(dataset, results);
            },
            async function(){
                datasets.shift();
                await loadDatasets(callback);
            },
            async function(){
                await eiteError('Error reported while parsing '+dataset+'!')
            }
        );
    }
    else {
        await callback();
    }
}

datasets=[
    'DcData',
    'mappings/from/ascii',
    'mappings/from/unicode',
    'mappings/to/html'
];
// @license-end
