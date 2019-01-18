async function getEnvPreferredFormat() {
    // Note that this routine will produce different outputs on different StageL target platforms, and that's not a problem since that's what it's for.
    return envPreferredFormat;
}

async function getEnvResolutionW() {
    // Result for this is either in pixels or characters. For immutableCharacterCells, it's just the number of columns available, defaulting to 80 if we can't tell, and says 1 line available.
    return envResolutionW;
}

async function getEnvResolutionH() {
    return envResolutionH;
}

async function getEnvCharEncoding() {
    return envCharEncoding;
}
