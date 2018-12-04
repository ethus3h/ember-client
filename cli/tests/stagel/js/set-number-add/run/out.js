/* A string is an array of 8-bit bytes. */
async function fizzBuzz() {
    let strReturn;

    /* return-assert -n # the output should be non-empty. */
    let int1;
    while !(
        await implEq(intCounter, 100)) {
        intCounter = await implAdd(intCounter, 1, let 