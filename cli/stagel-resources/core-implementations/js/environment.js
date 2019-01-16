async function getEnvironmentPreferredFormat() {
    // Note that this routine will produce different outputs on different StageL target platforms, and that's not a problem since that's what it's for.
    if (haveDom) {
        return 'HTML';
    }
    return 'immutableCharacterCells';
}
