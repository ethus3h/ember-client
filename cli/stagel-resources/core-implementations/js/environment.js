async function implGetEnvironmentBestFormat() {
    if (haveDom) {
        return 'HTML';
    }
    return 'immutableCharacterCells';
}

