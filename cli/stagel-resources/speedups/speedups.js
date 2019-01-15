async function or(a,b) {
    await assertIsBool(a); await assertIsBool(b);
    return a || b;
}

async function assertIsTrue(bool) {
    if (bool === true) {
        return;
    }
    await assertionFailed(bool+' is not true.');
}

async function assertIsFalse(bool) {
    if (bool === false) {
        return;
    }
    await assertionFailed(bool+' is true, but should be false.');
}
