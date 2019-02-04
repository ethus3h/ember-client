window.assertIsFalse = async function (bool) {
    if (bool === false) {
        return;
    }
    await assertionFailed(bool+' is true, but should be false.');
}

window.assertIsTrue = async function (bool) {
    if (bool === true) {
        return;
    }
    await assertionFailed(bool+' is not true.');
}

window.assertIsDc = async function (v) {
    if (await Number.isInteger(v) && v >= 0 && v <= 2147483647) {
        return true;
    }
    await assertIsTrue(false);
}

window.assertIsDcDataset = async function (str) {
    if (datasets.includes(str)) {
        return;
    }
    await assertIsTrue(false);
}

window.or = async function (a,b) {
    if (typeof a === 'boolean' && typeof b === 'boolean') {
        return a || b;
    }
    await assertIsBool(a); await assertIsBool(b);
}

window.isTrue = async function (bool) {
    if (bool === true) {
        // Can't simplify to if(bool) because non-bools might evaluate to true and give wrong result
        return true;
    }
    return false;
}

window.isFalse = async function (bool) {
    if (bool === false) {
        return true;
    }
    return false;
}
