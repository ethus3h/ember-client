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


async function isIntArray(val) {
    if (val === undefined) {
        await assertionFailed('isIntArray called with non-StageL-supported argument type.');
    }
    if (val.constructor.name === 'Uint8Array') {
        return true;
    }
    if (val.constructor.name !== 'Array') {
        return false;
    }
    function isGenericSync(v) {
        return (typeof v === 'boolean' || typeof v === 'string' || (Number.isInteger(v) && v >= -2147483648 && v <= 2147483647));
    }
    return val.every(isGenericSync);
}
