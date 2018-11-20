async function fbSwitcher(intNum) {
    await assertIsInt(intNum); let strReturn;

    if (await implEq(0, await implMod(intNum, 15))) {
        /* just a literal sequence of bytes. Everything should be binary safe. 0x could be used to return data, too. 0x = data, not numbers, in StageL. */

        testReturn = 'FizzBuzz'; await assertIsTest(testReturn); return testReturn;
    }
    /* Comment */
    if (await implEq(0, await implMod(intNum, 5))) {
        /* Comment 2 */

        testReturn = 'Buzz'; await assertIsTest(testReturn); return testReturn;
        /* Comment 3 */
    }
    if (    /* Could also write it like this, with the condition on another line */

        await implEq(0, await implMod(intNum, 3))) {
        /* Comment 4 */

        testReturn = 'Fizz'; await assertIsTest(testReturn); return testReturn;
    }

/* A string is an array of 8-bit bytes. */
async function fizzBuzz() {
    let strReturn;

    /* return-assert -n # the output should be non-empty. */
    let literal-n1;
    await until() {
await implEq(intCounter, 100,         =intCounter, await implAdd(intCounter, 1);
 {
);
 {
);
 {

        testReturn = ; await assertIsTest(testReturn); return testReturn;
    }
}
