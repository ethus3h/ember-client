async function getEnvironmentPreferredFormat() {
    if (haveDom) {
        return 'HTML';
    }
    return 'immutableCharacterCells';
}
