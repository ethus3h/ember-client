async function f() {
    let strReturn;

    let int1;
    while !(
        await implEq(intCounter, 100)) {
        intCounter = await implAdd(intCounter, 1);
    }
}
