async function assertIsFalse(bool) {
    if (bool === false) {
        return;
    }
    await assertionFailed(bool+' is true, but should be false.');
}

async function assertIsTrue(bool) {
    if (bool === true) {
        return;
    }
    await assertionFailed(bool+' is not true.');
}

async function assertIsDc(dc) {
    if (await Number.isInteger(v) && v >= 0 && v <= 2147483647) {
        return true;
    }
    await assertIsDc(dc);
}

async function assertIsDcDataset(str) {
    if (datasets.includes(str)) {
        return;
    }
    await assertIsDcDataset(str);
}

async function or(a,b) {
    if (typeof a === 'boolean' && typeof b === 'boolean') {
        return a || b;
    }
    await assertIsBool(a); await assertIsBool(b);
}

async function isTrue(bool) {
    if (bool === true) {
        // Can't simplify to if(bool) because non-bools might evaluate to true and give wrong result
        return true;
    }
    return false;
}

async function isFalse(bool) {
    if (bool === false) {
        return true;
    }
    return false;
}
