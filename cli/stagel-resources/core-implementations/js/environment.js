async function getEnvPreferredFormat() {
    // Note that this routine will produce different outputs on different StageL target platforms, and that's not a problem since that's what it's for.
    return envPreferredFormat;
}

async function getEnvResolutionW() {
    // Result for this is either in pixels or characters. For immutableCharacterCells, it's just the number of columns available, defaulting to 80 if we can't tell, and says 1 line available. If it's -1, it's unlimited (probably this would only occur if explicitly configured as such).
    return envResolutionW;
}

async function getEnvResolutionH() {
    // See getEnvResolutionW description.
    return envResolutionH;
}

async function getEnvCharEncoding() {
    return envCharEncoding;
}

async function renderDrawContents(renderBuffer) {
    // Whether it appends or replaces the frame would depend on the environment.
    // The input is an array of bytes of the rendered document, either of HTML or text.
    let string = renderBuffer
    if(haveDom) {
        
    }
}
