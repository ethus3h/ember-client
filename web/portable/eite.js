// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0
// This file contains portable code for all JavaScript implementations of EITE.
// This is a library file, and should only initialize functions/variables, so that it can be loaded and run in parallel with other library files, and work regardless of the order they are loaded.
// It also serves as an example implementation that should be written in a way that is easily ported to other platforms.
// To serve these two goals, it should not use I/O, objects, first-class functions, JavaScript-specific libraries, or null/undefined values.
// TODO: It should probably also declare all array sizes? Or else, put array operations into the non-portable categories, and have a set of impl* functions as an API for them instead.

async function dcarrConvertDocument(dcarrInput, strTargetFormat) {
    dcarrOutput=[];
    // Build render output buffer for specified format
    let intInputLength = 0;
    switch (strTargetFormat) {
        case "integerList":
            intInputLength = await intDcarrLength(dcarrInput);
            for (let intInputIndex = 0; intInputIndex < intInputLength; intInputIndex++) {
                dcarrOutput[intInputIndex] = dcarrInput[intInputIndex];
            }
            break;
        case "immutableCharacterCells":
            let intLine = 0;
            dcarrOutput[0] = -1;
            intInputLength = await intDcarrLength(dcarrInput);
            for (let intInputIndex = 0; intInputIndex < intInputLength; intInputIndex++) {
                let dcAtInputIndex = await dcCustomTypeDcarrDcAtPos(dcarrInput, intInputIndex);
                //await implLog(await strFrom(dcAtInputIndex));
                if (await dcIsNewline(dcAtInputIndex)) {
                    intLine = intLine + 1;
                    dcarrOutput[intLine] = -1;
                }
                if (await dcIsPrintable(dcAtInputIndex) || await dcIsSpace(dcAtInputIndex) ) {
                    dcarrOutput[intLine] = dcarrOutput[intLine] + await strPrintableDcToChar(dcAtInputIndex, await getEnvCharset());
                    //await implLog(await strPrintArr(dcarrOutput));
                }
            }
            break;
        case "HTML":
            dcarrOutput = [];
            intInputLength = await intDcarrLength(dcarrInput);
            for (let intInputIndex = 0; intInputIndex < intInputLength; intInputIndex++) {
                let dcAtInputIndex = await get(dcarrInput, intInputIndex);
                //await implLog(await strFrom(dcAtInputIndex));
                /* FIXME: doesn't accept HTML-renderable Dcs */
                if (await dcIsNewline(dcAtInputIndex) || await dcIsPrintable(dcAtInputIndex) || await dcIsSpace(dcAtInputIndex)) {
                    await dcarrOutput.push(dcAtInputIndex);
                    //await implLog(await strPrintArr(dcarrOutput));
                }
            }
            break;
        default:
            await eiteError("Unimplemented document render target format: " + strTargetFormat);
            break;
    }
    return dcarrOutput;
}

// @license-end
