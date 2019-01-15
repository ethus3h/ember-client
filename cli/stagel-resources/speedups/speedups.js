async function or(a,b) {
    await assertIsBool(a); await assertIsBool(b);
    return a || b;
}
