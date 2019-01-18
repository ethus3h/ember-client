async function getEnvironmentPreferredFormat() {
    // Note that this routine will produce different outputs on different StageL target platforms, and that's not a problem since that's what it's for.
    if (haveDom) {
        return 'HTML';
    }
    return 'immutableCharacterCells';
}

async function getEnvironmentResolutionW() {
    // Result for this is either in pixels or characters. For immutableCharacterCells, it's just the line width, and 
    if (haveDom) {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    return 'immutableCharacterCells';
}
