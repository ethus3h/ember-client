async function getEnvPreferredFormat() {
    // Note that this routine will produce different outputs on different StageL target platforms, and that's not a problem since that's what it's for.
    return getSharedState('envPreferredFormat');
}

async function getEnvResolutionW() {
    // Result for this is either in pixels or characters. For immutableCharacterCells, it's just the number of columns available, defaulting to 80 if we can't tell, and says 1 line available. If it's -1, it's unlimited (probably this would only occur if explicitly configured as such).
    return getSharedState('envResolutionW');
}

async function getEnvResolutionH() {
    // See getEnvResolutionW description.
    return getSharedState('envResolutionH');
}

async function getEnvCharEncoding() {
    return getSharedState('envCharEncoding');
}

async function getEnvTerminalType() {
    return getSharedState('envTerminalType');
}

async function getEnvLanguage() {
    return getSharedState('envLanguage');
}

async function getEnvCodeLanguage() {
    return getSharedState('envCodeLanguage');
}

async function getEnvLocaleConfig() {
    return getSharedState('envLocaleConfig');
}

async function renderDrawContents(renderBuffer) {
    // Whether it appends to or replaces the frame would depend on the environment. In this implementation, HTML replaces, and terminal appends.
    // The input is an array of bytes of the rendered document, either of HTML or text.
    await assertIsByteArray(renderBuffer);
    let utf8decoder = new TextDecoder('utf-8');
    let string = utf8decoder.decode(Uint8Array.from(renderBuffer));
    if (haveDom) {
        await eiteHostCall('internalRequestRenderDrawHTMLToDOM', [string]);
    }
    else {
        await console.log(string);
    }
}

async function internalRequestRenderDrawHTMLToDOM(htmlString) {
    let htmlOutputRootElement = await document.getElementById('eiteDocumentRoot');
    htmlOutputRootElement.innerHTML = htmlString;
    htmlOutputRootElement.scrollTop = htmlOutputRootElement.scrollHeight;
}

async function getImportSettingsArr() {
    await assertIsStrArray(getSharedState('importSettings'));

    return getSharedState('importSettings');
}

async function getExportSettingsArr() {
    await assertIsStrArray(getSharedState('exportSettings'));

    return getSharedState('exportSettings');
}

async function setImportSettings(formatId, strNewSettings) {
    await assertIsStr(strNewSettings);

    await implDebug('State change for import settings for '+formatId+' to '+strNewSettings+'.', 1);

    let temp;
    temp=getSharedState('importSettings');
    temp[formatId]=strNewSettings;
    setSharedState('importSettings', temp);
}

async function setExportSettings(formatId, strNewSettings) {
    await assertIsStr(strNewSettings);

    await implDebug('State change for export settings for '+formatId+' to '+strNewSettings+'.', 1);

    let temp;
    temp=getSharedState('exportSettings');
    temp[formatId]=strNewSettings;
    setSharedState('exportSettings', temp);
}

async function setImportDeferredSettingsStack(newStack) {
    await assertIsStrArray(newStack);

    await implDebug('State change for import deferred settings stack to '+newStack+'.', 1);

    setSharedState('strArrayImportDeferredSettingsStack', newStack);
}

async function setExportDeferredSettings(newStack) {
    await assertIsStr(newStack);

    await implDebug('State change for export deferred settings stack to '+newStack+'.', 1);

    setSharedState('strArrayImportDeferredSettingsStack', newStack);
}

async function setStorageSettings(strArrayNewSettings) {
    await assertIsStrArray(strArrayNewSettings);
    setSharedState('strArrayStorageCfg', strArrayNewSettings);
}

async function getStorageSettings(strArrayNewSettings) {
    return getSharedState('strArrayStorageCfg');
}
