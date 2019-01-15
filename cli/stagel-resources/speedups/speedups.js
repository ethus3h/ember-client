async function or(a,b) {
    if(typeof a === 'boolean' && typeof b === 'boolean') {
        return a || b;
    }
    await assertIsBool(a); await assertIsBool(b);
}

async function isTrue(bool) {
    if (bool === true) {
        return true;
    }
    await assertionFailed(bool+' is not true.');
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
