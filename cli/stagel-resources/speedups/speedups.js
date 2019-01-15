async function or(a,b) {
    await assertIsBool(a); await assertIsBool(b);
    return a || b;
}
/* TODO: move assertIsTrue/assertIsFalse to StageR once bool literals are available */
async function assertIsTrue(bool) {
    await assertIsBool(bool);

    if (bool !== true) {
        await assertionFailed(bool+' is not true.');
    }
}

async function assertIsFalse(bool) {
    await assertIsBool(bool);

    if (bool !== false) {
        await assertionFailed(bool+' is not false.');
    }
}
