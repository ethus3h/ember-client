/* Could also write it like this, with the condition on another line */
if (await implEq(0, await implMod(intNum, 3))) {

        strReturn = 'Fizz'; await assertIsStr(strReturn); return strReturn;
    }
}
