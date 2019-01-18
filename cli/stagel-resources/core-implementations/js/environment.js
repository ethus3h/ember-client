async function getEnvironmentPreferredFormat() {
    // Note that this routine will produce different outputs on different StageL target platforms, and that's not a problem since that's what it's for.
    return environmentPreferredFormat;
}

async function getEnvironmentResolutionW() {
    // Result for this is either in pixels or characters. For immutableCharacterCells, it's just the number of columns available, and says 1 line available.
    return environmentResolutionW;
}

async function getEnvironmentResolutionH() {
    return environmentResolutionH;
}
